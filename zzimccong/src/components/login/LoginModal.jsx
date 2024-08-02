import React from "react";
import Login from "./Login"; // Login 컴포넌트 import
import '../../assets/css/style.css';

const LoginModal = ({ showModal, onClose }) => {
    if (!showModal) {
      return null;
    }
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
        
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
          <Login /> 
        </div>
      </div>
    );
  };
  
  export default LoginModal;
