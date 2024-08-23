import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "./AskDetailComponent.css"; // 문의 상세 페이지를 위한 CSS 파일

const AskDetailComponent = () => {
  const { inquiryId } = useParams(); // URL 파라미터로부터 inquiryId를 가져옵니다.
  const [inquiry, setInquiry] = useState(null); // 문의 내용을 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 오류 상태 관리

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const response = await axios.get(`/api/ask/${inquiryId}`);
        setInquiry(response.data);
      } catch (err) {
        console.error("문의 내용을 불러오는 중 오류 발생:", err);
        setError("문의 내용을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiry();
  }, [inquiryId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!inquiry) {
    return <div>문의 내용을 불러오지 못했습니다.</div>;
  }

  return (
    <div className="AskDetailComponent-container">
      <h2 className="AskDetailComponent-title">{inquiry.title}</h2>
      <p className="AskDetailComponent-content">{inquiry.content}</p>
    </div>
  );
};

export default AskDetailComponent;
