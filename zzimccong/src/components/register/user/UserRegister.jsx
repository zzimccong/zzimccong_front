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
            console.error('ID check error:', error);
        }
    };

    const handleCheckEmail = async () => {
        try {
            const response = await axios.get('/api/users/check-email', { params: { email: formData.email } });
            setEmailExists(response.data);
        } catch (error) {
            console.error('Email check error:', error);
        }
    };

    const handleSendVerificationCode = async () => {
        try {
            const response = await axios.post('/api/users/send-sms', { phone: formData.phone });
            if (response.status === 200) {
                setVerificationCodeSent(true);
                setTimer(30); // 30초 타이머 설정
                alert('Verification code sent successfully');
            }
        } catch (error) {
            console.error('Error sending verification code:', error);
            alert('Failed to send verification code');
        }
    };

    const handleVerifyCode = async () => {
        try {
            const response = await axios.post('/api/users/verify-sms', { phone: formData.phone, verificationCode });
            if (response.status === 200) {
                setIsPhoneVerified(true);
                alert('Phone number verified successfully');
            } else {
                alert('Invalid verification code');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            alert('Failed to verify code');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!passwordMismatch && !idExists && !emailExists && isPhoneVerified) {
            try {
                const response = await axios.post('/api/users/user-register', formData);
                if (response.status === 200) {
                    alert('Registration successful');
                    navigate('/account'); // 필요한 경우 올바른 경로로 변경
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert(`Registration failed: ${error.response?.data || error.message}`);
            }
        } else {
            alert('Please ensure all fields are correctly filled and phone number is verified.');
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
