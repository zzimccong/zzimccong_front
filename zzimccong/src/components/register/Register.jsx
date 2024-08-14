import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserRegister from './user/UserRegister';
import CorpRegister from './corp/CorpRegister';
import './Register.css';

const Register = () => {
    const [selectedButton, setSelectedButton] = useState('회원가입');
    const navigate = useNavigate();

    const handleNavigation = (buttonType) => {
        setSelectedButton(buttonType);
    };

    return (
        <div className="register-wrapper">
            <div className="register-container">
                <h2 className="register-title">찜꽁테이블</h2>
                <div className="register-header">
                    <button
                        className={`register-header-button ${selectedButton === '회원가입' ? 'active' : ''}`}
                        onClick={() => handleNavigation('회원가입')}
                    >
                        회원가입
                    </button>
                    <span className="register-separator">|</span>
                    <button
                        className={`register-header-button ${selectedButton === '기업 회원가입' ? 'active' : ''}`}
                        onClick={() => handleNavigation('기업 회원가입')}
                    >
                        기업 회원가입
                    </button>
                </div>
                {selectedButton === '회원가입' ? (
                    <UserRegister />
                ) : (
                    <CorpRegister navigate={navigate} />
                )}
            </div>
        </div>
    );
};

export default Register;
