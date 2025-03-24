import React, { useState } from 'react';
import { X, Monitor } from 'lucide-react';

interface MobileWarningModalProps {
  onClose: () => void;
}

const MobileWarningModal: React.FC<MobileWarningModalProps> = ({ onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(true);

  const handleClose = () => {
    // If checkbox is checked, we should save the dismissal preference
    if (dontShowAgain) {
      // Store in localStorage that user has dismissed the warning
      localStorage.setItem('mobileWarningDismissed', 'true');
    } else {
      // Clear localStorage to ensure the warning appears again
      localStorage.removeItem('mobileWarningDismissed');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Monitor className="w-6 h-6 mr-2 text-blue-500" />
              Desktop Recommended
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-5">
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              For the best experience with our symptom checker, we recommend
              using a desktop computer.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              While the application works on mobile devices, the larger screen
              of a desktop provides a better view of all the information and
              options.
            </p>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="dont-show-again"
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="dont-show-again"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Don&apos;t show this message again
            </label>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileWarningModal;
