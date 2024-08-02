import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import '../../../assets/css/style.css';
import ChangePasswordModal from '../../../components/register/ChangePasswordModal';
import DeleteCorpModal from './DeleteCorpModal';


const CorpEdit = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        corpName: '',
        corpDept: '',
        corpId: '',
        corpEmail: '',
        corpAddress: '',
        emailVerified: false,
    });

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/corporations/${user.corpId}`);
                const { corpId, corpName, corpDept, corpEmail, corpAddress, emailVerified } = response.data;
                setFormData({
                    corpId,
                    corpName,
                    corpDept,
                    corpEmail,
                    corpAddress,
                    emailVerified,
                });
            } catch (error) {
                console.error('Failed to fetch corporation data', error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.corpId) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handlePasswordConfirmChange = (e) => {
        setPasswordConfirm(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.corpName || !formData.corpDept || !formData.corpEmail || !formData.corpAddress) {
            alert("All fields are required");
            return;
        }
        if (password !== passwordConfirm) {
            alert("Passwords do not match");
            return;
        }

        const updateData = { ...formData };
        if (password) {
            updateData.password = password;
        }

        try {
            await axios.put(`/api/corporations/${user.corpId}`, updateData);
            alert('Information updated successfully');
            const updatedUser = { ...user, ...updateData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
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
            <h2>Edit Corporation Information</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-item">
                    <label>Corporation ID</label>
                    <input type="text" name="corpId" value={formData.corpId} disabled />
                </div>
                <div className="form-item">
                    <label>Corporation Name</label>
                    <input type="text" name="corpName" value={formData.corpName} onChange={handleChange} />
                </div>
                <div className="form-item">
                    <label>Corporation Department</label>
                    <input type="text" name="corpDept" value={formData.corpDept} onChange={handleChange} />
                </div>
                <div className="form-item">
                    <label>Corporation Email</label>
                    <input type="email" name="corpEmail" value={formData.corpEmail} onChange={handleChange} />
                </div>
                <div className="form-item">
                    <label>Corporation Address</label>
                    <input type="text" name="corpAddress" value={formData.corpAddress} onChange={handleChange} />
                </div>
                <div className="form-item password-item">
                    <label>Password</label>
                    <div className="password-input">
                        <input type="password" name="password" value={password} onChange={handlePasswordChange} />
                        <button type="button" onClick={openChangePasswordModal} className="change-password-button">Change Password</button>
                    </div>
                </div>
                <div className="form-item">
                    <label>Confirm Password</label>
                    <input type="password" name="passwordConfirm" value={passwordConfirm} onChange={handlePasswordConfirmChange} />
                </div>
                <div className="button-group">
                    <button type="submit" className="update-button">Update Information</button>
                    <button type="button" onClick={openDeleteAccountModal} className="delete-account-button">Delete Account</button>
                </div>
            </form>

            <ChangePasswordModal
                showModal={showChangePasswordModal}
                onClose={closeChangePasswordModal}
                userId={user.corpId || user.loginId}
                userType={user.corpId ? 'corp' : 'user'}
            />
            <DeleteCorpModal
                showModal={showDeleteAccountModal}
                onClose={closeDeleteAccountModal}
                userId={user.corpId || user.loginId}
                logout={logout}
            />
        </div>
    );
};

export default CorpEdit;
