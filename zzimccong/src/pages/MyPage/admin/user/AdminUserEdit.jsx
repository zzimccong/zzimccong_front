import React, { useState, useEffect } from 'react';
import axios from '../../../../utils/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import AdminDeleteUserModal from './AdminDeleteUserMoadl';

function AdminUserEdit() {
    const { id } = useParams(); // URL에서 id 파라미터를 추출
    const [user, setUser] = useState({
        loginId: '',
        password: '',
        name: '',
        birth: '',
        email: '',
        phone: '',
        role: '',
        // 필요한 다른 필드들
    });
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 모달 상태
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/admin/edit-user/${id}`); // 사용자 정보를 불러오는 요청
                setUser(response.data); // 응답 데이터를 상태에 저장
            } catch (error) {
                console.error('Error fetching user details:', error);
                alert('Failed to fetch user details');
            }
            setLoading(false);
        };

        if (id) {
            fetchUserDetails(); // 유효한 ID가 있을 때만 사용자 데이터를 불러옴
        } else {
            console.error("No user ID provided in the URL.");
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`/api/admin/edit-user/${id}`, user); // 사용자 정보를 업데이트하는 요청
            alert('User updated successfully');
            navigate('/user-management'); // 업데이트 후 사용자 관리 페이지로 이동
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
        setLoading(false);
    };

    const handleDelete = () => {
        setShowDeleteModal(true); // 삭제 모달 표시
    };

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>User not found</div>;

    return (
        <div>
            <h1>Edit User</h1>
            <form onSubmit={handleSubmit}>
                <label>ID : <nbsp />
                    <input type="text" name="loginId" value={user.loginId || ''} disabled />
                </label>
                <label>비밀번호 : <nbsp />
                    <input type="password" name="password" value={user.password || ''} disabled />
                </label>
                <label>
                    이름 : <nbsp />
                    <input
                        type="text"
                        name="name"
                        value={user.name || ''}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Email : <nbsp />
                    <input
                        type="email"
                        name="email"
                        value={user.email || ''}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    휴대폰 : <nbsp />
                    <input
                        type="text"
                        name="phone"
                        value={user.phone || ''}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    구분 : <nbsp />
                    <input
                        type="text"
                        name="role"
                        value={user.role || ''}
                        onChange={handleInputChange}
                    />
                </label>
                <button type="submit" disabled={loading}>일반 회원 정보 수정</button> <br/>
                <button type="button" onClick={handleDelete} disabled={loading}>일반 회원 정보 삭제</button>
            </form>
            {showDeleteModal && (
                <AdminDeleteUserModal
                    showModal={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    userId={id}
                    logout={() => navigate('/')}
                />
            )}
        </div>
    );
}

export default AdminUserEdit;
