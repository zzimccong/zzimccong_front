import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';
import '../../../assets/css/style.css';

const DeleteUserModal = ({ showModal, onClose, userId, logout }) => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const response = await axios.post(`/api/users/${userId}/delete`, { password });
            if (response.status === 200) {
                alert('계정이 성공적으로 삭제되었습니다.');
                logout();
                onClose();
                navigate('/account');
                window.location.reload();
            } else {
                alert('비밀번호가 틀렸습니다.');
            }
        } catch (error) {
            console.error('계정 삭제 실패', error);
            alert('계정 삭제를 실패하였습니다.');
        }
    };

    if (!showModal) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    &times; 닫기
                </button>
                <h2>계정 삭제</h2>
                <p>계정을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.</p>
                <div className="form-item">
                    <label>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button onClick={handleDelete} className="delete-button">삭제 확인</button>
                <button onClick={onClose} className="cancel-button">취소</button>
            </div>
        </div>
    );
};

export default DeleteUserModal;
