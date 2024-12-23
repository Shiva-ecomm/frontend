import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { message } from "antd";
import axios from "axios";
import host from "../APIRoute/host";
import CardDefault from "../components/CardDefault";

const Home = () => {
  const [tenders, setTenders] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const currentDate = Date.now();

  // Fetch tenders
  const fetchTenders = async () => {
    try {
      const res = await axios.get(`${host}/tendor/get-tendors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setTenders(res.data.tendors);
      }
    } catch (error) {
      message.error("Something went wrong while fetching tenders.");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchTenders();
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-8">
          {/* Admin-only: Add Tenders */}
          {user?.isAdmin && (
            <div className="flex justify-center mb-8">
              <Link
                to="/add-tendor"
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <FaPlus /> Add New Tender
              </Link>
            </div>
          )}

          {/* Tenders Section */}
          <section className="space-y-16">
            {/* Ongoing Tenders */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                Ongoing Tenders
              </h2>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {tenders.length === 0 ? (
                  <p className="col-span-full text-center text-lg">
                    No ongoing tenders available.
                  </p>
                ) : (
                  tenders.map((tender, index) => {
                    const closesOnDate = new Date(tender?.closesOn);
                    return (
                      closesOnDate >= currentDate &&
                      tender?.active && (
                        <CardDefault
                          key={index}
                          card={tender}
                          refreshTenders={fetchTenders}
                          active={true}
                        />
                      )
                    );
                  })
                )}
              </div>
            </div>

            {/* Completed Tenders */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500">
                Completed Tenders
              </h2>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {tenders.length === 0 ? (
                  <p className="col-span-full text-center text-lg">
                    No completed tenders available.
                  </p>
                ) : (
                  tenders.map((tender, index) => {
                    const closesOnDate = new Date(tender?.closesOn);
                    return (
                      closesOnDate < currentDate &&
                      !tender?.active && (
                        <CardDefault
                          key={index}
                          card={tender}
                          refreshTenders={fetchTenders}
                          active={user?.isAdmin ? false : true}
                        />
                      )
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </main>

        <Footer />

        {/* Dark Mode Toggle */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-4 bg-gray-300 dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {darkMode ? (
              <span
                role="img"
                aria-label="Light Mode"
                className="text-yellow-400 text-lg"
              >
                ☀️
              </span>
            ) : (
              <span
                role="img"
                aria-label="Dark Mode"
                className="text-gray-900 text-lg"
              >
                🌙
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
