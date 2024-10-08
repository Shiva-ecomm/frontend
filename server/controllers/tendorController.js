const admin = require('firebase-admin'); // Import Firebase Admin SDK
const { getDownloadURL, ref, uploadBytesResumable } = require('firebase/storage');
const firebase = require('../firebase');
const nodemailer = require('nodemailer');
const {  getStorage } = require('firebase/storage');
const serviceAccount = require('../helpers/serviceAccount'); // Replace with the path to your service account key file
const postModel = require('../model/postModel');
const formatDate = require('../helpers/formatDate');
const clientModel = require('../model/clientModel');
var smtpTransport = require('nodemailer-smtp-transport');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_PATH,
});


const uploadImagesController = async (req, res) => {
    try {
        const files = req.files; // `req.files` will contain the uploaded files
        const { title, descr, qty, validParty, id, name } = req.body;

        // Check for uploaded files
        if (!files || files.length === 0) {
            return res.status(400).send({ success: false, message: 'No files uploaded' });
        }

        const downloadURLs = [];

        // Process each file
        for (const item of files) {
            const storage = getStorage(firebase);
            const storageRef = ref(storage, `files/${item.originalname}`);

            // Upload the file to Firebase Storage
            const uploadTask = uploadBytesResumable(storageRef, item.buffer);

            // Wait for the upload to complete
            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        // console.log(`Upload is ${progress.toFixed(2)}% done`);
                    },
                    (error) => {
                        // console.error('Upload error:', error);
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then((downloadURL) => {
                                downloadURLs.push(downloadURL);
                                // console.log('File available at', downloadURL);
                                resolve();
                            })
                            .catch(reject);
                    }
                );
            });
        }

      

        // Create a new post with the data
        const newPost = new postModel({
            title,
            description: descr,
            qty,
            images: downloadURLs,
            validParty: JSON.parse(validParty),
            addedBy: id,
            addedByName: name,
        });
        const transporter = nodemailer.createTransport(smtpTransport({
            host:'smtp.gmail.com',
            port:'587',
           secure:false,
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASS_KEY // Consider using an App Password for Gmail
            },
            // secure: true, // Use secure connection
            // logger: true,
            // debug: true,
            // tls:true
        }));

        const closingDate = Date.now() + (1000 * 60 * 60 * 48);
        const partyList = JSON.parse(validParty);

        for (let item of partyList) {
            const party = await clientModel.findOne({ _id: item });
            if (!party) {
                return res.status(400).send({ message: 'Party not found', success: false });
            }
            // console.log(party?.email)
            const mailOptions = {
                from: 'shubhamsur09@gmail.com',
                to: party.email,
                subject: 'A New Tender Has Opened',
                text: `Dear Vendor,

                We are excited to announce that a new tender has been opened!

                Tender Title: ${title}
                Closing Date: ${formatDate(closingDate)}
                Details: ${descr}

                We encourage you to review the tender and submit your proposal by the closing date. If you have any questions or need further information, please don't hesitate to reach out. Below is the link to fill the tender: http://localhost:3000/SharingPage/${item}/${newPost._id}

                Best regards,

                Shiva TexFabs`
            };

            try {
                await transporter.sendMail(mailOptions);
                // console.log(`Email sent to ${party.email}`);
            } catch (emailError) {
                // console.error(`Failed to send email to ${party.email}:`, emailError);
            }
        }

        // Save the new post if needed
        await newPost.save();
        return res.status(200).json({ success: true, message: 'Files uploaded successfully', newPost });

    } catch (error) {
        // console.error('Error occurred:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};

const getAllTendorsController = async (req, res) => {
    try {
        const tendors = await postModel.find().sort({ createdOn: -1 }); // Sort by createdOn in descending order
        
        if (!tendors || tendors.length === 0) {
            return res.status(404).send({ message: 'No tendors available', success: false });
        }

        const currentDate = Date.now();
        const updates = []; // Store updates to minimize DB calls

        for (const item of tendors) {
            if (item.closesOn < currentDate) {
                item.active = false;
                updates.push(item.save()); // Add save operations to the updates array
            }
        }

        // Execute all save operations concurrently
        await Promise.all(updates);

        return res.status(200).send({ message: 'Fetched', success: true, tendors });
    } catch (error) {
        // console.error('Error fetching tendors:', error.message);
        return res.status(500).send({ message: 'Internal Server Error', success: false });
    }
};



const getTendorDetail=async(req,res)=>{
    try{
        const id=req.params.id;
        const tendor=await postModel.findOne({_id:id});
        if(!tendor){
            return res.status(400).send({message:'No tendor found',success:false})
        }
        let quotations=[];
        for(let item of tendor?.quotations){
            const client=await clientModel.findOne({_id:item?.party});
            if(!client){
                return res.status(404).send({message:'Party not found',success:false})
            }
            quotations.push({addedOn:item?.addedOn,name:client?.name,email:client?.email,phone:client?.phone,city:client?.city,id:client?._id,rate:item?.rate})
        }
        return res.status(200).send({message:'tendor fetched',success:true,tendor,quotations})

    }catch(error){
        // console.log(error.message)
        return res.status(500).send({message:'Internal Server Error',success:false})
    }
}

const changeStateController=async(req,res)=>{
    try{
        const id=req.params.id;
        const tendor=await postModel.findOne({_id:id})
        if(!tendor){
            return res.status(400).send({success:false,message:'tendor not found'})
        }
        tendor.active=false;
        tendor.closesOn=Date.now();
        await tendor.save();
        return res.status(200).send({success:true,message:'Tendor closed successfully',tendor})

    }catch(error){
        // console.log(error.message)
        return res.status(500).send({message:'Internal Server Error',success:false})
    }
}

const updateQuotationController=async(req,res)=>{
    try{
        const clientId=req.params.clientId;
        const postId=req.params.postId;
        const {rate}=req.body;
        const post=await postModel.findOne({_id:postId});
        if(!post){
            return res.status(404).send({message:'Post not found',success:false})
        }
        post.quotations.push({party:clientId,rate:rate});
        await post.save();
        return res.status(200).send({success:true,message:'Quotation added successfully',post});

    }catch(error){
        // console.log(error.message)
        return res.status(500).send({message:'Internal Server Error',success:false})
    }
}

module.exports = { uploadImagesController,getAllTendorsController,getTendorDetail,changeStateController,updateQuotationController };
