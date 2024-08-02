import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import FindPasswordModal from './find/FindPasswordModal'; 
import logo2 from '../../assets/icons/logo2.png';
import logo from '../../assets/icons/logo.png';
import '../../assets/css/style.css';
import FindIdModal from './find/FindIdModal ';

const Login = () => {
    const [formData, setFormData] = useState({
        id: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { login } = useContext(AuthContext);
    const [isIdModalOpen, setIsIdModalOpen] = useState(false); // 아이디 찾기 모달 열림 상태
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // 비밀번호 찾기 모달 열림 상태

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            // 로컬 스토리지에서 로그인 관련 값 삭제
            localStorage.removeItem('token'); // 토큰 삭제
            localStorage.removeItem('user');  // 사용자 정보 삭제
            window.localStorage.removeItem('profile'); // 프로필 삭제

            // 기업 ID 확인
            const corpIdCheckResponse = await axios.get('/api/corporations/check-id', { params: { corpId: formData.id } });
            const isCorpId = corpIdCheckResponse.data;

            // 로그인 엔드포인트 설정
            let endpoint = isCorpId ? '/api/corporations/login' : '/api/users/login';
            let data = { password: formData.password };
            if (isCorpId) {
                data.corpId = formData.id;
            } else {
                data.loginId = formData.id;
            }

            // 로그인 요청
            const response = await axios.post(endpoint, data);
            const { token, user } = response.data;

            if (typeof token !== 'string') {
                throw new Error('Invalid token format');
            }

            // 새로운 로그인 정보 저장
            login(token, user);

            // 홈 페이지로 이동
            navigate('/');
        } catch (error) {
            console.error('There was an error logging in!', error);
            setErrorMessage('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
        } finally {
            setLoading(false);
        }
    };

    const openIdModal = () => {
        setIsIdModalOpen(true);
    };

    const closeIdModal = () => {
        setIsIdModalOpen(false);
    };

    const openPasswordModal = () => {
        setIsPasswordModalOpen(true);
    };

    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src={logo2} alt="Logo" className="logo" />
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="id"
                            id="id"
                            placeholder="아이디"
                            value={formData.id}
                            onChange={handleChange}
                            required
                            className="input"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="비밀번호"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="input"
                        />
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <div className="button-container">
                        <button type="submit" className="login-button" disabled={loading}>
                            <img src={logo} alt="Login Icon" className="button-icon" />
                            {loading ? '로그인 중...' : '로그인'}
                        </button>
                    </div>
                </form>
                <div className="links-container">
                    <span className="link" onClick={() => navigate('/register')}>회원가입</span>
                    <div className="right-links">
                        <span className="link" onClick={openIdModal}>아이디 찾기</span>
                        <span className="separator">|</span>
                        <span className="link" onClick={openPasswordModal}>비밀번호 찾기</span>
                    </div>
                </div>
            </div>
            <FindIdModal showModal={isIdModalOpen} onClose={closeIdModal} />
            <FindPasswordModal showModal={isPasswordModalOpen} onClose={closePasswordModal} />
        </div>
    );
};

export default Login;
