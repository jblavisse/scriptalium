import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Notification({ message, type, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); 
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed right-4 bottom-4 transition-transform duration-100 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      role="alert"
    >
      <div
        className={`p-4 rounded-lg shadow-md flex items-center ${
          type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        <span className="text-white mr-3">{message}</span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
