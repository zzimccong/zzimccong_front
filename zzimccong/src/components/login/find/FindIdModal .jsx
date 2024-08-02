import React from 'react';
import FindId from './FindId';
import '../../../assets/css/style.css'; 

const FindIdModal = ({ showModal, onClose }) => {
    if (!showModal) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                <FindId />
            </div>
        </div>
    );
};

export default FindIdModal;
