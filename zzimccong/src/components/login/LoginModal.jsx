import React from "react";
import Login from "./Login";
import './Login.css';

const LoginModal = ({ showModal, onClose }) => {
    if (!showModal) {
      return null;
    }
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>&times;</button>
          <Login />
        </div>
      </div>
    );
};

export default LoginModal;
