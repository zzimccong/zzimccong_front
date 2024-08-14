import React, { useState, useEffect } from 'react';
import axios from '../../../../utils/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import AdminDeleteCorpMoadl from './AdminDeleteCorpModal';

function AdminCorpEdit() {
    const { id } = useParams(); // URL에서 id 파라미터를 추출
    const [corp, setCorp] = useState({
        corpName: '',
        corpDept: '',
        corpId: '',
        password: '',
        corpEmail: '',
        corpAddress: '',
        role: '',
    });
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 모달 표시 상태
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCorpDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/admin/edit-corp/${id}`); // 사용자 정보를 불러오는 요청
                setCorp(response.data); // 응답 데이터를 상태에 저장
            } catch (error) {
                console.error('Error fetching corp details:', error);
            }
            setLoading(false);
        };

        if (id) {
            fetchCorpDetails(); // 유효한 ID가 있을 때만 사용자 데이터를 불러옴
        } else {
            console.error("No corp ID provided in the URL.");
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCorp(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`/api/admin/edit-corp/${id}`, corp); // 사용자 정보를 업데이트하는 요청
            alert('Corp updated successfully');
            navigate('/corp-management'); // 업데이트 후 사용자 관리 페이지로 이동
        } catch (error) {
            console.error('Error updating corp:', error);
            alert('Failed to update corp');
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        setShowDeleteModal(true); // 모달을 표시
    };


    if (loading) return <div>Loading...</div>;
    if (!corp) return <div>Corp not found</div>;

    return (
        <div>
            <h1>Edit Corp</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    기업명 : <nbsp/>
                    <input
                        type="text"
                        name="corpName"
                        value={corp.corpName}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    부서명 : <nbsp/>
                    <input
                        type="text"
                        name="corpDept"
                        value={corp.corpDept}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    아이디 : <nbsp/>
                    <input
                        type="text"
                        name="corpId"
                        value={corp.corpId}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                   비밀번호 : <nbsp/>
                    <input
                        type="password"
                        name="password"
                        value={corp.password}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    회사 이메일 : <nbsp/>
                    <input
                        type="email"
                        name="corpEmail"
                        value={corp.corpEmail}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    회사 주소 : <nbsp/>
                    <input
                        type="text"
                        name="corpAddress"
                        value={corp.corpAddress}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    구분 : <nbsp/>
                    <input
                        type="text"
                        name="role"
                        value={corp.role}
                        onChange={handleInputChange}
                    />
                </label>
                <button type="submit" disabled={loading}>기업 회원 정보 수정</button><br/>
                <button type="button" onClick={handleDelete} disabled={loading}>기업 회원 정보 삭제</button>
            </form>
            {showDeleteModal && (
                <AdminDeleteCorpMoadl
                    showModal={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    corpId={id}
                    logout={() => navigate('/')}
                />
            )}
        </div>
       

        
    );
}

export default AdminCorpEdit;
