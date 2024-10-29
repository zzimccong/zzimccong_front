import React, { useState, useEffect } from 'react';
import axios from '../../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

function CorpManagement() {
  const [corps, setCorps] = useState([]); // 사용자 목록을 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 컴포넌트가 마운트될 때 사용자 데이터를 불러옵니다.
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get('/api/admin/corps/all'); // API 경로는 실제 설정에 맞게 조정해야 합니다.
        setCorps(response.data); // 응답 데이터를 상태에 저장
        setLoading(false); // 로딩 상태 업데이트
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false); // 에러 발생 시 로딩 상태 업데이트
      }
    }

    fetchUsers();
  }, []);

  const handleEdit = (corpId) => {
    navigate(`/edit-corp/${corpId}`); // 사용자 ID를 사용하여 정보 수정 페이지로 네비게이션
  };

  // 로딩 중일 때 로딩 인디케이터 표시
  if (loading) {
    return <div>Loading...</div>;
  }

  // 사용자 데이터를 테이블로 표시
  return (
    <div>
      <h1>User Management</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>회사명</th>
            <th>부서명</th>
            <th>이메일</th>
            <th>구분</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {corps.map(corp => (
            <tr key={corp.id}>
              <td>{corp.id}</td>
              <td>{corp.corpName}</td>
              <td>{corp.corpDept}</td>
              <td>{corp.corpEmail}</td>
              <td>{corp.role}</td>
              <td>
                <button onClick={() => handleEdit(corp.id)}>수정</button> {/* 수정 버튼 */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CorpManagement;
