import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import logo from '../../assets/icons/logo.png';
import "./AskDetailComponent.css"; // 문의 상세 페이지를 위한 CSS 파일

const AskDetailComponent = () => {
  const { inquiryId } = useParams(); // URL 파라미터로부터 inquiryId를 가져옵니다.
  const [inquiry, setInquiry] = useState(null); // 문의 내용을 저장할 상태
  const [answer, setAnswer] = useState(null);
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

    const fetchAnswer = async () => {
      try {
        const response = await axios.get(`/api/ask/Answer/${inquiryId}`);
        console.log(response.status);
        if (response.data.content === null) {
          setAnswer(null);
        } else {
          setAnswer(response.data);
          console.log(response.data);
        }
      } catch (err) {
        if (err.response && err.response.status === 500) {
          console.error("서버에서 오류가 발생했습니다:", err);
          setAnswer(null); // 답변이 없을 경우
        } else {
          console.error("답변 내용을 불러오는 중 오류 발생:", err);
          setError("답변 내용을 불러오는 중 오류가 발생했습니다.");
        }
      }
    };

    fetchInquiry();
    fetchAnswer();
  }, [inquiryId]);

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!inquiry) {
    return <div className="no-inquiry">문의 내용을 불러오지 못했습니다.</div>;
  }

  return (
    <div>
      <div className="header">
        <img src={logo} className="logo" />
        <div className="searchcomponent_title">1:1 문의</div>
      </div>
      <div className="AskDetailComponent-container">
        <div>
          <div className="AskDetailComponent-titleBox">
            {inquiry.title}
          </div>
          <div className="AskDetailComponent-contentBox">
            {inquiry.content}
          </div>
          {answer && (
            <>
              <hr/>
              <p className="AskDetailComponent-answerTitle">▷ 답변</p>
              <div className="AskDetailComponent-contentBox">
                {answer.content}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
    
  );
};

export default AskDetailComponent;
