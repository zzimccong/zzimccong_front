import React from 'react';
import '../../../assets/css/style.css'; // 스타일 가져오기
import FindPassword from './FindPassword';

const FindPasswordModal = ({ showModal, onClose }) => {
    if (!showModal) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                <FindPassword />
            </div>
        </div>
    );
};

export default FindPasswordModal;
