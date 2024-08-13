import React from "react";
import ChangePassword from "./ChangePassword";
import '../../../assets/css/style.css';

const ChangePasswordModal = ({ showModal, onClose, userId, userType }) => {
    if (!showModal) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                <ChangePassword userId={userId} userType={userType} closeModal={onClose} />
            </div>
        </div>
    );
};

export default ChangePasswordModal;
