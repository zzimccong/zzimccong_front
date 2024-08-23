import React, { useState, useEffect } from "react";
import "./AskComponent.css"; // CSS 파일을 임포트합니다.
import axios from "../../utils/axiosConfig"; // 백엔드 API 호출을 위한 axios 임포트
import { useNavigate } from "react-router-dom";

const AskComponent = () => {
  const [activeTab, setActiveTab] = useState("inquiry");
  const [inquiries, setInquiries] = useState([]); // 문의 내역을 저장할 상태
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(null); // 오류 상태 관리
  const [showPasswordModal, setShowPasswordModal] = useState(false); // 모달 상태 관리
  const [selectedInquiry, setSelectedInquiry] = useState(null); // 선택한 문의
  const [inputPassword, setInputPassword] = useState(""); // 입력한 비밀번호
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "history") {
      fetchInquiriesByUser();
    } else if (activeTab === "inquiry") {
      fetchAllInquiries();
    }
  }, [activeTab]);

  // 사용자 정보 (로컬스토리지에서 가져오기)
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const role = user?.role;

  // 백엔드에서 특정 사용자의 문의 내역을 받아오는 함수
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

  // 백엔드에서 모든 문의 내역을 받아오는 함수
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

  // 비밀글 클릭 시 모달을 띄우는 함수
  const handleSecretInquiryClick = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowPasswordModal(true);
  };

  // 비밀글 확인 함수
  const handlePasswordSubmit = () => {
    if (inputPassword === selectedInquiry.askPassword) {
      setShowPasswordModal(false);
      setInputPassword(""); // 비밀번호 초기화
      navigate(`/inquiry/${selectedInquiry.id}`);
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  // 모달 취소 버튼 클릭 시 처리 함수
  const handleCancel = () => {
    setShowPasswordModal(false);
    setInputPassword(""); // 비밀번호 초기화
  };

  // 문의 클릭 시 상세 페이지로 이동하는 함수
  const handleInquiryClick = (inquiry) => {
    if (inquiry.secret) {
      handleSecretInquiryClick(inquiry);
    } else {
      navigate(`/inquiry/${inquiry.id}`);
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
      <div className="inquiry-list">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="inquiry-item" onClick={() => handleInquiryClick(inquiry)}>
            <h3 className="inquiry-title">{inquiry.secret ? "비밀글" : inquiry.title}</h3>
            <hr className="inquiry-divider" />
          </div>
        ))}
      </div>
    );
  };

  const handleCreateInquiryClick = () => {
    navigate("/register-ask");
  };

  return (
    <div className="AskComponent-container">
      <h2 className="AskComponent-title">1:1 문의</h2>
      <div className="AskComponent-tab-container">
        <div
          className={`AskComponent-tab ${
            activeTab === "inquiry" ? "AskComponent-active" : ""
          }`}
          onClick={() => setActiveTab("inquiry")}
        >
          문의하기
        </div>
        <div
          className={`AskComponent-tab ${
            activeTab === "history" ? "AskComponent-active" : ""
          }`}
          onClick={() => setActiveTab("history")}
        >
          내 문의내역
        </div>
      </div>
      <div className="AskComponent-underline-container">
        <div
          className={`AskComponent-underline ${
            activeTab === "inquiry" ? "AskComponent-active-underline" : ""
          }`}
        ></div>
        <div
          className={`AskComponent-underline ${
            activeTab === "history" ? "AskComponent-active-underline" : ""
          }`}
        ></div>
      </div>

      <div className="AskComponent-content-container">{renderContent()}</div>

      <button className="AskComponent-inquiry-button" onClick={handleCreateInquiryClick}>
        문의하기
      </button>

      {showPasswordModal && (
        <div className="password-modal">
          <div className="password-modal-content">
            <h3>비밀번호 입력</h3>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
            <button onClick={handlePasswordSubmit}>확인</button>
            <button onClick={handleCancel}>취소</button> {/* 취소 버튼 클릭 시 handleCancel 호출 */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AskComponent;
