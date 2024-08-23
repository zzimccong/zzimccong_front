import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';

import DeleteUserModal from './../user/DeleteUserModal';
import './KakaoEdit.css';  // 별도의 CSS 파일

const KakaoEdit = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        loginId: '',
        name: '',
        birth: '',
        email: '',
        phone: '',
        role: 'USER',
    });
    const [loading, setLoading] = useState(true);

    
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/users/${user.loginId}`);
                console.log('Fetched user data:', response.data);
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
                setLoading(false);
            }
        };

        if (user && user.loginId) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`/api/users/${user.loginId}`, formData);
            alert('정보가 성공적으로 업데이트되었습니다.');
        } catch (error) {
            console.error('정보 업데이트 실패', error);
            alert('정보 업데이트 실패');
        }
    };


    const openDeleteAccountModal = () => {
        setShowDeleteAccountModal(true);
    };

    const closeDeleteAccountModal = () => {
        setShowDeleteAccountModal(false);
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="edit-container">
            <form onSubmit={handleSubmit}>
                <div className="form-item">
                    <label>아이디</label>
                    <input type="text" name="loginId" value={formData.loginId} disabled />
                </div>
                <div className="form-item">
                    <label>이름</label>
                    <input type="text" name="name" value={formData.name} disabled />
                </div>
                <div className="form-item">
                    <label>이메일</label>
                    <input type="email" name="email" value={formData.email} disabled />
                </div>
                <div className="form-item">
                    <label>전화번호</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-item">
                    <label>생년월일</label>
                    <input type="date" name="birth" value={formData.birth} onChange={handleChange} />
                </div>
                <div className="button-group">
                    <button type="submit" className="update-button">수정</button>
                    <button type="button" onClick={openDeleteAccountModal} className="delete-account-button">탈퇴</button>
                </div>
            </form>
            <DeleteUserModal
                showModal={showDeleteAccountModal}
                onClose={closeDeleteAccountModal}
                userId={user.loginId}
                logout={logout}
            />
        </div>
    );
};

export default KakaoEdit;
