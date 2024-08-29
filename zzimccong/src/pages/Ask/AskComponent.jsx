import React, { useState, useEffect } from "react";
import "./AskComponent.css"; 
import axios from "../../utils/axiosConfig"; 
import { useNavigate } from "react-router-dom";
import logo from '../../assets/icons/logo.png';
import secretIcon from '../../assets/icons/secret.png';

const AskComponent = () => {
  const [activeTab, setActiveTab] = useState("inquiry");
  const [inquiries, setInquiries] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [showPasswordModal, setShowPasswordModal] = useState(false); 
  const [selectedInquiry, setSelectedInquiry] = useState(null); 
  const [inputPassword, setInputPassword] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "history") {
      fetchInquiriesByUser();
    } else if (activeTab === "inquiry") {
      fetchAllInquiries();
    }
  }, [activeTab]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const role = user?.role;

  const fetchInquiriesByUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/ask/user", {
        params: { id: userId, role: role }
      });
      setInquiries(response.data);
    } catch (err) {
      console.error("문의 내역을 불러오는 중 오류 발생:", err);
      setError("문의 내역을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllInquiries = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/ask/all");
      setInquiries(response.data);
    } catch (err) {
      console.error("모든 문의를 불러오는 중 오류 발생:", err);
      setError("모든 문의를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSecretInquiryClick = (inquiry) => {
    if (role === 'ADMIN') {
      // ADMIN은 비밀글이라도 바로 접근 가능
      navigate(`/inquiry/${inquiry.id}`);
    } else {
      // 비밀글 클릭 시 모달을 띄웁니다.
      setSelectedInquiry(inquiry);
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = () => {
    if (inputPassword === selectedInquiry.askPassword) {
      setShowPasswordModal(false);
      setInputPassword("");
      navigate(`/inquiry/${selectedInquiry.id}`);
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  const handleCancel = () => {
    setShowPasswordModal(false);
    setInputPassword("");
  };

  const handleInquiryClick = (inquiry) => {
    if (inquiry.secret) {
      handleSecretInquiryClick(inquiry);
    } else {
      if (role === 'ADMIN'){
        navigate(`/admin-answer-register/${inquiry.id}`);
      }
      else {
        navigate(`/inquiry/${inquiry.id}`);
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div>로딩 중...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    if (inquiries.length === 0) {
      return <div>문의 내역이 없습니다.</div>;
    }

    return (
      <div>
       
        <div className="inquiry-list">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="inquiry-item"
              onClick={() => handleInquiryClick(inquiry)}
            >
              <h3 className="inquiry-title">
                {inquiry.secret ? (
                  <>
                    {inquiry.title}
                    <img src={secretIcon} alt="비밀글" className="secret-icon" />
                  </>
                ) : (
                  inquiry.title
                )}
              </h3>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleCreateInquiryClick = () => {
    navigate("/register-ask");
  };

  return (
    <div>
      <div className="header">
        <img src={logo} className="logo" />
        <div className="AskComponent-title">1:1 문의</div>
      </div>
      <div className="AskComponent-container">
        <div className="AskComponent-tabs">
          <button
            onClick={() => setActiveTab('inquiry')}
            className={`AskComponent-tab-item ${activeTab === 'inquiry' ? 'active' : ''}`}
          >
            문의하기
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`AskComponent-tab-item ${activeTab === 'history' ? 'active' : ''}`}
          >
            내 문의내역
          </button>
        </div>

        <div className="AskComponent-tab-content">
          {renderContent()}
        </div>

        <button className="AskComponent-inquiry-button" onClick={handleCreateInquiryClick}>
          문의하기
        </button>

        {showPasswordModal && (
          <div className="AskComponent-password-modal">
            <div className="AskComponent-password-modal-content">
              <h3>비밀번호 입력</h3>
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
              />
              <button onClick={handlePasswordSubmit}>확인</button>
              <button onClick={handleCancel}>취소</button>
            </div>
          </div>
        )}
      </div>
    </div>
    
  );
};

export default AskComponent;
