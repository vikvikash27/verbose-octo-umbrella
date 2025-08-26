import React, { useEffect } from 'react';
import { CloseIcon } from '../icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-800">
            {title}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 p-1 rounded-full">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 flex-grow overflow-y-auto">{children}</div>
        {footer && <div className="p-4 bg-slate-50 rounded-b-lg flex justify-end gap-3 flex-shrink-0">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
