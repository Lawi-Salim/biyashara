import React, { useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import './Toast.css';

const Toast = ({ id, message, type }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 3000); // Auto-dismiss after 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [id, removeToast]);

  return (
    <div className={`toast toast--${type}`} onClick={() => removeToast(id)}>
      <p className="toast-message">{message}</p>
    </div>
  );
};

export default Toast;
