import React, { useState } from 'react';
import axios from '../../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

function AdminDeleteCorpModal({ showModal, onClose, corpId }) {
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
            await axios.delete(`/api/admin/delete-corp/${corpId}`, {
                data: { password }
            });
            alert('기업 회원이 성공적으로 삭제되었습니다.');
            setLoading(false);
            onClose(); // 모달 닫기
            navigate('/corp-management'); // 삭제 후 관리자 페이지로 이동
        } catch (error) {
            console.error('기업 회원 삭제 중 오류 발생:', error);
            alert('기업 회원 삭제에 실패했습니다.');
            setLoading(false);
        }
    };

    if (!showModal) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>기업 회원 삭제</h2>
                <p>정말로 이 기업 회원을 삭제하시겠습니까?</p>
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

export default AdminDeleteCorpModal;
