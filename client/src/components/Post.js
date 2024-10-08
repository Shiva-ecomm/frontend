import React,{useState,useEffect} from 'react'
import '../styles/SharingPage.css'

const Post = ({slides,tendor}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
  
  
    const nextSlide = () => {
      setCurrentIndex((currentIndex + 1) % slides.length);
    };
  
    const prevSlide = () => {
      setCurrentIndex((currentIndex - 1 + slides.length) % slides.length);
    };
    useEffect(()=>{
      // console.log(slides)
    },[])
  
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      
      // Options for formatting
      const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      };
    
      // Format the date using Intl.DateTimeFormat
      return date.toLocaleString('en-US', options).replace(',', '');
    };

  return (
    <>
      <div className='shared-post'>
          <div className='user'>
            <div className='icon'>
              <i className="fa-regular fa-user"></i>
            </div>
            <div className='details' style={{flexDirection:'column'}}>
              <span>{tendor?.addedByName || 'Admin'}</span>
              <span>{formatDate(tendor?.createdOn)}</span>
            </div>
          </div>

          <div className='product'>
            <div className='product-name'>
              <span>Product Name:</span>
              <span>{tendor?.title}</span>
            </div>
            <div className='qty'>
              <span>Quantity:</span>
              <span>{tendor?.qty?.$numberDecimal || tendor?.qty} </span>
            </div>
            <div className='description'>
              <span>
                {tendor?.description}
              </span>
            </div>
            <div className='carousel-containers'>
              <button className='carousel-control-prev' onClick={prevSlide}>&#10094;</button>
              {slides?.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  className={`carousel-item ${currentIndex === index ? 'active' : ''}`}
                  alt={`Slide ${index + 1}`}
                />
              ))}
              <button className='carousel-control-next' onClick={nextSlide}>&#10095;</button>
            </div>

            
          </div>
          
        </div>
    </>
  )
}

export default Post
