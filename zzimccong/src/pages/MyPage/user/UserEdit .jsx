import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import '../../../assets/css/style.css';
import ChangePasswordModal from '../../../components/login/changePassword/ChangePasswordModal';
import DeleteUserModal from './DeleteUserModal';

const UserEdit = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        loginId: '',
        password: '',
        passwordConfirm: '',
        name: '',
        birth: '',
        email: '',
        phone: '',
        role: 'USER',
    });
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/users/${user.loginId}`);
                console.log('Fetched user data:', response.data); // API 응답 확인
                setFormData({
                    loginId: response.data.loginId,
                    name: response.data.name,
                    birth: response.data.birth,
                    email: response.data.email,
                    phone: response.data.phone,
                    role: response.data.role,
                    password: '',
                    passwordConfirm: '',
                });
            } catch (error) {
                console.error('Failed to fetch user data', error);
            } finally {
                setLoading(false); // 데이터 로드 후 로딩 상태 false
            }
        };

        if (user && user.loginId) {
            fetchData();
        } else {
            setLoading(false); // user가 정의되지 않은 경우 로딩 상태 false
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.passwordConfirm) {
            alert("Passwords do not match");
            return;
        }

        try {
            await axios.put(`/api/users/${user.loginId}`, formData);
            alert('Information updated successfully');
        } catch (error) {
            console.error('Failed to update information', error);
            alert('Failed to update information');
        }
    };

    const openChangePasswordModal = () => {
        setShowChangePasswordModal(true);
    };

    const closeChangePasswordModal = () => {
        setShowChangePasswordModal(false);
    };

    const openDeleteAccountModal = () => {
        setShowDeleteAccountModal(true);
    };

    const closeDeleteAccountModal = () => {
        setShowDeleteAccountModal(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-container">
            <h2>Edit User Information</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-item">
                    <label>Login ID</label>
                    <input type="text" name="loginId" value={formData.loginId} disabled />
                </div>
                <div className="form-item">
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-item">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-item">
                    <label>Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-item">
                    <label>Birth</label>
                    <input type="date" name="birth" value={formData.birth} onChange={handleChange} />
                </div>
                <div className="form-item">
                    <label>Role</label>
                    <input type="text" name="role" value={formData.role} disabled />
                </div>
                <div className="form-item password-item">
                    <label>Password</label>
                    <div className="password-input">
                        <input type="password" name="password" value={formData.password} onChange={handleChange} />
                        <button type="button" onClick={openChangePasswordModal} className="change-password-button">Change Password</button>
                    </div>
                </div>
                <div className="form-item">
                    <label>Confirm Password</label>
                    <input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} />
                </div>
                <div className="button-group">
                    <button type="submit" className="update-button">Update Information</button>
                    <button type="button" onClick={openDeleteAccountModal} className="delete-account-button">Delete Account</button>
                </div>
            </form>

            <ChangePasswordModal
                showModal={showChangePasswordModal}
                onClose={closeChangePasswordModal}
                userId={user.loginId}
                userType='user'
            />
            <DeleteUserModal
                showModal={showDeleteAccountModal}
                onClose={closeDeleteAccountModal}
                userId={user.loginId}
                logout={logout}
            />
        </div>
    );
};

export default UserEdit;
