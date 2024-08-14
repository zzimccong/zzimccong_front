import React, { useState, useEffect } from 'react';
import axios from '../../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

function UserManagement() {
  const [users, setUsers] = useState([]); // 사용자 목록을 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get('/api/admin/users/all');
        setUsers(response.data); // 응답 데이터를 상태에 저장
        setLoading(false); // 로딩 상태 업데이트
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false); // 에러 발생 시 로딩 상태 업데이트
      }
    }

    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`); // 사용자 ID를 사용하여 정보 수정 페이지로 네비게이션
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>User Management</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user.id)}>수정</button> {/* 수정 버튼 */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
