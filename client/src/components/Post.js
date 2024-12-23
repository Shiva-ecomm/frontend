import React, { useState, useEffect } from 'react';

const Post = ({ slides, tendor }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    
  }, [slides]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleString('en-US', options).replace(',', '');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6">
      <div className="flex items-center space-x-4">
        <div className="icon w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full">
          <i className="fa-regular fa-user text-gray-600 dark:text-white"></i>
        </div>
        <div className="details flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-white">
            {tendor?.addedByName || 'Admin'}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formatDate(tendor?.createdOn)}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="product-name text-lg font-semibold text-gray-800 dark:text-white">
          <span>Product Name:</span>
          <span className="font-sm text-gray-700 dark:text-gray-300">  {tendor?.title}</span>
        </div>
        <div className="qty mt-2 text-gray-800 dark:text-white">
          <span className="font-semibold">Quantity:</span>
          <span className="font-sm">  {tendor?.qty?.$numberDecimal || tendor?.qty}</span>
        </div>
        <div className="qty mt-2 text-gray-800 dark:text-white">
          <span className="font-semibold">Color:</span>
          {tendor?.color && tendor?.color?.map((item)=>{
            return(
              <span className="font-sm"> {item},  </span>
            )
          })}
        </div>
        <div className="description mt-2 text-gray-800 dark:text-white">
          <span>{tendor?.description}</span>
        </div>

        <div className="carousel-containers relative mt-6">
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2"
            onClick={prevSlide}
          >
            &#10094;
          </button>

          <div className="carousel-images flex overflow-hidden rounded-lg shadow-lg">
            {slides?.map((url, index) => (
              <img
                key={index}
                src={url}
                className={`carousel-item w-full transition-opacity duration-300 ${
                  currentIndex === index ? 'opacity-100' : 'opacity-0'
                }`}
                alt={`Slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2"
            onClick={nextSlide}
          >
            &#10095;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
