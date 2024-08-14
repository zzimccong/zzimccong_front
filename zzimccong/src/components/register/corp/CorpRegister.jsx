import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/icons/logo.png';
import './CorpRegister.css';

const CorpRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        corpName: '',
        corpDept: '',
        corpId: '',
        password: '',
        passwordConfirm: '',
        corpEmail: '',
        emailVerified: false,
        corpAddress: '',
        role: 'CORP',
    });

    const [idExists, setIdExists] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationCodeSent, setVerificationCodeSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (formData.password && formData.passwordConfirm) {
            setPasswordMismatch(formData.password !== formData.passwordConfirm);
        }
    }, [formData.password, formData.passwordConfirm]);

    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(timer - 1);
            }, 1000);
        } else if (interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckId = async () => {
        try {
            const response = await axios.get('/api/corporations/check-id', { params: { corpId: formData.corpId } });
            setIdExists(response.data);
        } catch (error) {
            console.error('아이디 중복 확인 오류:', error);
        }
    };

    const handleCheckEmail = async () => {
        try {
            const response = await axios.get('/api/corporations/check-email', { params: { corpEmail: formData.corpEmail } });
            setEmailExists(response.data);
        } catch (error) {
            console.error('이메일 중복 확인 오류:', error);
        }
    };

    const handleSendVerificationEmail = async () => {
        try {
            const response = await axios.post('/api/email/send-verification', { corpEmail: formData.corpEmail });
            if (response.status === 200) {
                setVerificationCodeSent(true);
                setTimer(30); // 30초 타이머 설정
                alert('인증 코드가 성공적으로 전송되었습니다.');
            }
        } catch (error) {
            console.error('인증 코드 전송 오류:', error);
            alert('인증 코드 전송에 실패했습니다.');
        }
    };

    const handleVerifyCode = async () => {
        try {
            const response = await axios.post('/api/email/verify-code', { corpEmail: formData.corpEmail, verificationCode });
            if (response.status === 200) {
                setIsEmailVerified(true);
                setFormData({ ...formData, emailVerified: true });
                alert('이메일 인증에 성공했습니다.');
            } else {
                alert('잘못된 인증 코드입니다.');
            }
        } catch (error) {
            console.error('인증 코드 확인 오류:', error);
            alert('인증 코드 확인에 실패했습니다.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!passwordMismatch && !idExists && !emailExists && isEmailVerified) {
            try {
                const response = await axios.post('/api/corporations/corp-register', formData);
                if (response.status === 200) {
                    alert('회원가입에 성공했습니다.');
                    navigate('/account');
                }
            } catch (error) {
                console.error('회원가입 오류:', error);
                alert(`회원가입에 실패했습니다: ${error.response?.data || error.message}`);
            }
        } else {
            alert('모든 필드를 올바르게 작성하고 이메일 인증을 완료해주세요.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="corp-register-form">
            <input
                type="text"
                name="corpName"
                placeholder="회사명"
                value={formData.corpName}
                onChange={handleChange}
                required
                className="corp-register-input"
            />
            <input
                type="text"
                name="corpDept"
                placeholder="부서명"
                value={formData.corpDept}
                onChange={handleChange}
                required
                className="corp-register-input"
            />
            <input
                type="text"
                name="corpId"
                placeholder="아이디"
                value={formData.corpId}
                onChange={handleChange}
                onBlur={handleCheckId}
                required
                className="corp-register-input"
            />
            {idExists && <div className="corp-register-error">이미 사용 중인 아이디입니다.</div>}
            <input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
                required
                className="corp-register-input"
            />
            <input
                type="password"
                name="passwordConfirm"
                placeholder="비밀번호 확인"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                className="corp-register-input"
            />
            {passwordMismatch && <div className="corp-register-error">비밀번호와 비밀번호 확인이 일치하지 않습니다.</div>}
            <div className="email-verification-container">
                <input
                    type="email"
                    name="corpEmail"
                    placeholder="이메일"
                    value={formData.corpEmail}
                    onChange={handleChange}
                    onBlur={handleCheckEmail}
                    required
                    className="corp-register-input"
                />
                <button
                    type="button"
                    className="register-submit-button"
                    onClick={handleSendVerificationEmail}
                    disabled={timer > 0}
                >
                    {timer > 0 ? `재전송 (${timer}s)` : '이메일 인증 코드 발송'}
                </button>
            </div>
            {emailExists && <div className="corp-register-error">이미 사용 중인 이메일입니다.</div>}
            {verificationCodeSent && (
                <div className="email-verification-container">
                    <input
                        type="text"
                        name="verificationCode"
                        placeholder="인증 코드"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                        className="corp-register-input"
                    />
                    <button type="button" className="register-submit-button" onClick={handleVerifyCode}>
                        인증 코드 확인
                    </button>
                </div>
            )}
            <input
                type="text"
                name="corpAddress"
                placeholder="주소"
                value={formData.corpAddress}
                onChange={handleChange}
                required
                className="corp-register-input"
            />
            <button type="submit" className="corp-register-submit-button" disabled={!isEmailVerified}>
                <img src={logo} alt="Login Icon" className="corp-register-button-icon" />
                회원가입
            </button>
        </form>
    );
};

export default CorpRegister;
