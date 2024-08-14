import React, { useState } from 'react';
import axios from '../../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

function AdminDeleteUserModal({ showModal, onClose, userId }) {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            await axios.delete(`/api/admin/delete-user/${userId}`, {
                data: { password }
            });
            alert('사용자가 성공적으로 삭제되었습니다.');
            setLoading(false);
            onClose();
            navigate('/user-management'); // 사용자 관리 페이지로 이동
        } catch (error) {
            console.error('사용자 삭제 중 오류 발생:', error);
            alert('사용자 삭제에 실패했습니다.');
            setLoading(false);
        }
    };

    if (!showModal) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>사용자 삭제</h2>
                <p>정말로 이 사용자를 삭제하시겠습니까?</p>
                <input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleDelete} disabled={loading}>예, 삭제합니다</button>
                <button onClick={onClose} disabled={loading}>취소</button>
            </div>
        </div>
    );
}

export default AdminDeleteUserModal;
