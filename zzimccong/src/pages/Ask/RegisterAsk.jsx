import React, { useState } from "react";
import "./RegisterAsk.css"; // 스타일을 위한 CSS 파일
// import axios from "axios";  // Axios를 사용해 백엔드 API 호출
import axios from "../../utils/axiosConfig.js";

const RegisterAsk = () => {
  const [title, setTitle] = useState(""); // 제목 입력 상태
  const [isSecret, setIsSecret] = useState(false); // 비밀글 체크박스 상태
  const [content, setContent] = useState(""); // 문의 내용
  const [askPassword, setAskPassword] = useState(""); // 비밀번호 (비밀글인 경우)

  // LocalStorage에서 user 정보 가져오기
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const handleCheckboxChange = () => {
    setIsSecret(!isSecret); // 체크박스 상태 변경
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사: 제목과 내용이 비어 있으면 경고 메시지를 출력하고 제출 중단
    if (!title.trim()) {
      alert("제목을 입력하세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력하세요.");
      return;
    }

    // 비밀글이 아닐 경우 askPassword를 null로 설정
    const password = isSecret ? askPassword : null;

    // role에 따른 userId, corpId, userName, corpName 설정
    const askData = {
      role: role,
      userId: role === "USER" ? user?.id : null, // role이 USER이면 userId 설정
      corpId: role === "CORP" ? user?.id : null, // role이 CORP이면 corpId 설정
      userName: role === "USER" ? user?.name : null, // role이 USER이면 userName 설정
      corpName: role === "CORP" ? user?.corpName : null, // role이 CORP이면 corpName 설정
      title: title, // 제목 추가
      content: content,
      secret: isSecret,
      askPassword: password,
    };

    try {
      // 백엔드로 데이터 전송
      const response = await axios.post("/api/ask", askData);
      if (response.status === 200) {
        alert("문의가 성공적으로 등록되었습니다!");
      }
    } catch (error) {
      console.error("문의 등록 중 오류 발생:", error);
      alert("문의 등록에 실패했습니다.");
    }
  };

  return (
    <div className="RegisterAsk-container">
      <h2 className="RegisterAsk-title">1:1 문의</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="RegisterAsk-title-textarea"
          placeholder="제목을 입력하세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="RegisterAsk-textarea"
          placeholder="내용을 입력하세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <div className="RegisterAsk-options">
          <label className="RegisterAsk-checkbox-label">
            <input
              type="checkbox"
              checked={isSecret}
              onChange={handleCheckboxChange}
            />
            비밀글
          </label>

          {isSecret && (
            <input
              type="password"
              className="RegisterAsk-password"
              placeholder="비밀번호를 입력하세요."
              value={askPassword}
              onChange={(e) => setAskPassword(e.target.value)}
            />
          )}
        </div>

        <button type="submit" className="RegisterAsk-submit">
          등록하기
        </button>
      </form>
    </div>
  );
};

export default RegisterAsk;
