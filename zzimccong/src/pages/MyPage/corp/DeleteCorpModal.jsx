import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';
import '../../../assets/css/style.css';

const DeleteCorpModal = ({ showModal, onClose, userId, logout }) => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const response = await axios.post(`/api/corporations/${userId}/delete`, { password });
            if (response.status === 200) {
                alert('Account deleted successfully');
                logout();
                onClose();
                navigate('/account');
                window.location.reload();
            } else {
                alert('Invalid password');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Unauthorized: Invalid password or session expired');
            } else {
                console.error('Failed to delete account', error);
                alert('Failed to delete account');
            }
        }
    };

    if (!showModal) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                <h2>Delete Account</h2>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="form-item">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button onClick={handleDelete} className="delete-button">Confirm Delete</button>
                <button onClick={onClose} className="cancel-button">Cancel</button>
            </div>
        </div>
    );
};

export default DeleteCorpModal;
