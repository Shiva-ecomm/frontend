import React from "react";

const Confirmation = ({ onConfirm, onCancel, isConfirm, setIsConfirm }) => {
  const handleCancel = () => {
    setIsConfirm(false);
    if (onCancel) onCancel(); // Call the onCancel callback if provided
  };

  return (
    isConfirm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96 p-6 text-center">
          {/* Confirmation Message */}
          <span className="block text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Are you sure?
          </span>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-500 focus:ring-opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
              onClick={onConfirm}
            >
              Confirm
            </button>
            <button
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-400 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Confirmation;
