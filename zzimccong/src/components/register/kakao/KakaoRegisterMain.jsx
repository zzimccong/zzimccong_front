import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/style.css';
import KakaoRegister from './KakaoRegister';

const KakaoRegisterMain = () => {
    const [selectedButton, setSelectedButton] = useState('회원가입');
    const navigate = useNavigate();

    const handleNavigation = (buttonType) => {
        setSelectedButton(buttonType);
    };

    return (
        <div className="register-wrapper">
            <div className="register-container">
                
                <KakaoRegister/>
            </div>
        </div>
    );
};

export default KakaoRegisterMain;
