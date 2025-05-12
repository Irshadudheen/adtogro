
import { useState } from 'react';

function SimpleModal() {
  const [isOpen, setIsOpen] = useState(false);
 
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {/* Button to open modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Open Modal
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setIsOpen(false)} // Clicking background closes modal
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-80"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h2 className="text-xl font-semibold mb-4">Modal Title</h2>
            <p className="text-gray-600 mb-6">This is a simple modal example using Tailwind CSS in React.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SimpleModal;
