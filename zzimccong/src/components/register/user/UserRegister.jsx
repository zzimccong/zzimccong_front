import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 import
import logo from '../../../assets/icons/logo.png';
import '../../../assets/css/style.css';

const UserRegister = () => {
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [formData, setFormData] = useState({
        loginId: '',
        password: '',
        passwordConfirm: '',
        name: '',
        birth: '',
        email: '',
        phone: '',
        role: 'USER',
    });

    const [idExists, setIdExists] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationCodeSent, setVerificationCodeSent] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
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
            const response = await axios.get('/api/users/check-id', { params: { loginId: formData.loginId } });
            setIdExists(response.data);
        } catch (error) {
            console.error('ID 확인 요망:', error);
        }
    };

    const handleCheckEmail = async () => {
        try {
            const response = await axios.get('/api/users/check-email', { params: { email: formData.email } });
            setEmailExists(response.data);
        } catch (error) {
            console.error('Email 확인 요망:', error);
        }
    };

    const handleSendVerificationCode = async () => {
        try {
            const response = await axios.post('/api/users/send-sms', { phone: formData.phone });
            if (response.status === 200) {
                setVerificationCodeSent(true);
                setTimer(30); // 30초 타이머 설정
                alert('인증번호 전송 성공');
            }
        } catch (error) {
            console.error('Error sending verification code:', error);
            alert('인증번호 전송 실패');
        }
    };

    const handleVerifyCode = async () => {
        try {
            const response = await axios.post('/api/users/verify-sms', { phone: formData.phone, verificationCode });
            if (response.status === 200) {
                setIsPhoneVerified(true);
                alert('전화번호가 성공적으로 인증되었습니다');
            } else {
                alert('잘못된 인증 코드');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            alert('코드 인증 오류');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!passwordMismatch && !idExists && !emailExists && isPhoneVerified) {
            try {
                const response = await axios.post('/api/users/user-register', formData);
                if (response.status === 200) {
                    alert('등록이 완료되었습니다');
                    navigate('/account'); // 필요한 경우 올바른 경로로 변경
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert(`등록에 실패했습니다: ${error.response?.data || error.message}`);
            }
        } else {
            alert('모든 항목이 정확하게 입력되었고 전화번호가 인증되었는지 확인해 주세요.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-form">
            <input
                type="text"
                name="loginId"
                placeholder="아이디"
                value={formData.loginId}
                onChange={handleChange}
                onBlur={handleCheckId}
                required
                className="register-input"
            />
            {idExists && <div className="register-error">이미 사용 중인 아이디입니다.</div>}
            <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required className="register-input" />
            <input type="password" name="passwordConfirm" placeholder="비밀번호 확인" value={formData.passwordConfirm} onChange={handleChange} required className="register-input" />
            {passwordMismatch && <div className="register-error">비밀번호와 비밀번호 확인이 일치하지 않습니다.</div>}
            <input type="text" name="name" placeholder="이름" value={formData.name} onChange={handleChange} required className="register-input" />
            <input type="date" name="birth" placeholder="생년월일" value={formData.birth} onChange={handleChange} required className="register-input date-input" />
            <input
                type="email"
                name="email"
                placeholder="이메일"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleCheckEmail}
                required
                className="register-input"
            />
            {emailExists && <div className="register-error">이미 사용 중인 이메일입니다.</div>}
            <div className="phone-verification-container">
                <input type="text" name="phone" placeholder="전화번호" value={formData.phone} onChange={handleChange} required className="register-input" />
                <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    className="register-submit-button"
                    disabled={timer > 0}
                >
                    {timer > 0 ? `재전송 (${timer})` : '인증번호 전송'}
                </button>
            </div>
            {verificationCodeSent && (
                <div className="code-verification-container">
                    <input
                        type="text"
                        placeholder="인증번호"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                        className="register-input"
                    />
                    <button type="button" onClick={handleVerifyCode} className="register-submit-button">
                        인증번호 확인
                    </button>
                </div>
            )}
            <button type="submit" className="register-submit-button" disabled={!isPhoneVerified}>
                <img src={logo} alt="Login Icon" className="register-button-icon" />
                회원가입
            </button>
        </form>
    );
};

export default UserRegister;
