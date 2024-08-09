import React, { useState } from 'react';
import axios from '../../../utils/axiosConfig';
import '../../../assets/css/style.css';

const ChangePassword = ({ userId, userType, closeModal }) => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            alert("New passwords do not match");
            return;
        }

        try {
            const endpoint = userType === 'corp' ? `/api/corporations/${userId}/change-password` : `/api/users/${userId}/change-password`;
            await axios.put(endpoint, {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            });
            alert('Password changed successfully');
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
            closeModal();
        } catch (error) {
            console.error('Failed to change password', error);
            alert('Failed to change password');
        }
    };

    return (
        <div className="edit-container">
            <h2>비밀번호 변경</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-item">
                    <label>현재 비밀번호</label>
                    <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} />
                </div>
                <div className="form-item">
                    <label>새로운 비밀번호</label>
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
                </div>
                <div className="form-item">
                    <label>비밀번호 확인</label>
                    <input type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} />
                </div>
                <button type="submit">비밀번호 변경</button>
            </form>
        </div>
    );
};

export default ChangePassword;
