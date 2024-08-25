import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "./AskDetailComponent.css"; // 문의 상세 페이지를 위한 CSS 파일

const AskDetailComponent = () => {
  const { inquiryId } = useParams(); // URL 파라미터로부터 inquiryId를 가져옵니다.
  const [inquiry, setInquiry] = useState(null); // 문의 내용을 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState(null); // 오류 상태 관리
  const [content, setContent] = useState(""); // 답변 내용

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
        if(response.data.content === null) {
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

  // const user = JSON.parse(localStorage.getItem("user"));
  // const role = user?.role;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사: 내용이 비어 있으면 경고 메시지를 출력하고 제출 중단
    if (!content.trim()) {
      alert("내용을 입력하세요.");
      return;
    }
    
    //role에 따른 userId, corpId, userName, corpName 설정
    const answerData = {
      ask_id: inquiryId,
      content: content,
    };

    try {
      // 백엔드로 데이터 전송
      const response = await axios.post("/api/ask/Answer", answerData);
      if (response.status === 200) {
        alert("답변이 등록되었습니다!");
      }
    } catch (error) {
      console.error("답변 등록 중 오류 발생:", error);
      alert("답변 등록에 실패했습니다.");
    }
  };

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
    <div className="AskDetailComponent-container">
      <h2 className="AskDetailComponent-title">1:1 문의</h2>
      <div>
        <div className="AskDetailComponent-titleBox">
            {inquiry.title}
        </div>
        <div className="AskDetailComponent-contentBox">
          {inquiry.content}
        </div>
        <h4>답변</h4>
        {answer ? (
          <>
            <div className="AskDetailComponent-contentBox">
              {answer.content}
            </div>
          </>
        ) : (
          <div className="RegisterAsk-container">
            <form onSubmit={handleSubmit}>

              <textarea
                className="RegisterAsk-textarea"
                placeholder="내용을 입력하세요."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>

              <button type="submit" className="RegisterAsk-submit">
                등록하기
              </button>
            </form>
          </div>

        )}
        
      </div>
    </div>
  );
};

export default AskDetailComponent;
