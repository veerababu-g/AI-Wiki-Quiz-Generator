import React from 'react';
import { CloseIcon } from './icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-start z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-base-100 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mt-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-neutral p-4 border-b border-gray-700 flex justify-between items-center z-10">
            <h3 className="text-xl font-bold text-white">Quiz Details</h3>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
            >
                <CloseIcon />
            </button>
        </div>
        <div className="p-6">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
