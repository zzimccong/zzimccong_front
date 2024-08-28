import React from "react";
import jsPDF from "jspdf";
import axios from "../../../utils/axiosConfig";

const loadFont = async () => {
  try {
    const response = await fetch("/font/NotoSansKR-Regular.ttf");
    if (!response.ok) {
      throw new Error("Failed to fetch font file.");
    }

    const fontBlob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject("Error reading font file: " + error);
      };

      reader.readAsDataURL(fontBlob);
    });
  } catch (error) {
    console.error("Error loading font:", error);
    throw error;
  }
};

const loadImageAsBase64 = async (imageUrl) => {
  try {
    const response = await axios.get("/api/image-to-base64", {
      params: { url: imageUrl },
    });
    return response.data; // Base64 이미지 데이터
  } catch (error) {
    console.error("이미지 로드 에러:", error);
    throw error;
  }
};

const PDFExportButton = ({ reservations, restaurantDetails }) => {
  const formatReservationTime = (time) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Intl.DateTimeFormat("ko-KR", options).format(new Date(time));
  };

  const getShortenedAddress = (address) => {
    if (!address) return "";
    const parts = address.split(" ");
    return parts.length > 2 ? `${parts[0]} ${parts[1]}` : address;
  };

  const generatePDF = async () => {
    try {
      const base64Font = await loadFont();
      const doc = new jsPDF("p", "mm", "a4");

      // 폰트 설정
      doc.addFileToVFS("NotoSansKR-Regular.ttf", base64Font);
      doc.addFont("NotoSansKR-Regular.ttf", "NotoSansKR", "normal");
      doc.setFont("NotoSansKR", "normal");
      doc.setFontSize(12);

      let y = 20; // PDF 내에서의 Y 좌표 시작점

      // 회식비 지출 보고서 제목
      doc.setFontSize(18);
      doc.text("회식 신청 보고서", 105, y, null, null, "center");
      y += 15;

      // 기본 정보 영역
      doc.setFontSize(12);
      doc.setLineWidth(0.2);

      const rowHeight = 10; // 각 행의 높이
      const col1Width = 40; // 첫 번째 열 너비
      const col2Width = 50; // 두 번째 열 너비
      const col3Width = 50; // 세 번째 열 너비
      const col4Width = 50; // 네 번째 열 너비

      // 첫 번째 행 (보고일자)
      doc.rect(10, y, col1Width, rowHeight);
      doc.text("보고일자", 15, y + 7);
      doc.rect(10 + col1Width, y, col2Width + col3Width + col4Width, rowHeight);
      doc.rect(10 + col1Width + col2Width, y, col3Width, rowHeight);
      doc.text("보고자", 10 + col1Width + col2Width + 5, y + 7);
      doc.rect(10 + col1Width + col2Width + col3Width, y, col4Width, rowHeight);
      y += rowHeight;

      // 두 번째 행 (회식명, 회식시간)
      doc.rect(10, y, col1Width, rowHeight);
      doc.text("회식명", 15, y + 7);
      doc.rect(10 + col1Width, y, col2Width, rowHeight);
      doc.rect(10 + col1Width + col2Width, y, col3Width, rowHeight);
      doc.text("회식시간", 10 + col1Width + col2Width + 5, y + 7);
      doc.rect(10 + col1Width + col2Width + col3Width, y, col4Width, rowHeight);
      y += rowHeight;

      // 세 번째 행 (회식장소)
      doc.rect(10, y, col1Width, rowHeight);
      doc.text("회식장소", 15, y + 7);
      doc.rect(10 + col1Width, y, col2Width + col3Width + col4Width, rowHeight);
      y += rowHeight;

      // 네 번째 행 (회식목적)
      doc.rect(10, y, col1Width, rowHeight);
      doc.text("회식목적", 15, y + 7);
      doc.rect(10 + col1Width, y, col2Width + col3Width + col4Width, rowHeight);
      y += rowHeight;

      // 다섯 번째 행 (참가인원)
      doc.rect(10, y, col1Width, rowHeight);
      doc.text("참가인원", 15, y + 7);
      doc.rect(10 + col1Width, y, col2Width + col3Width + col4Width, rowHeight);
      y += rowHeight + 10; // 여백 추가

      // 각 가게 정보를 추가
let restaurantNumber = 1; // 가게 번호를 매기기 위한 변수
for (const reservation of reservations) {
  const restaurant = restaurantDetails[reservation.restaurantId];
  if (restaurant) {
    y += 10;

    // 페이지가 넘어가는지 확인하고 새 페이지 추가
    if (y + 100 > doc.internal.pageSize.height) {
      doc.addPage();
      y = 20;
    }

    // 회식 장소 및 정보 박스
    doc.setFontSize(12);
    doc.rect(10, y, 190, 45); // 레스토랑 정보 전체 박스

    const startX = 15;  // 가게 번호와 텍스트 간격 조정
    const startY = y + 7;
    const textGap = 8;

    // 가게 번호 추가
    doc.text(`${restaurantNumber}.`, startX, startY); // 가게 번호 출력
    restaurantNumber += 1;

    // 가게 정보 텍스트 박스
    doc.text("가게:", startX + 10, startY);
    doc.text(restaurant.name, startX + 38, startY);
    doc.line(startX + 10, startY + 3, 145, startY + 3); // 선 긋기

    doc.text("카테고리:", startX + 10, startY + textGap);
    doc.text(restaurant.category, startX + 38, startY + textGap);
    doc.line(startX + 10, startY + 3 + textGap, 145, startY + 3 + textGap); // 선 긋기

    doc.text("주소:", startX + 10, startY + textGap * 2);
    doc.text(getShortenedAddress(restaurant.roadAddress), startX + 38, startY + textGap * 2);
    doc.line(startX + 10, startY + 3 + textGap * 2, 145, startY + 3 + textGap * 2); // 선 긋기

    doc.text("예약 시간:", startX + 10, startY + textGap * 3);
    doc.text(formatReservationTime(reservation.reservationTime), startX + 38, startY + textGap * 3);

    // 이미지 로드 및 추가
    const base64Image = await loadImageAsBase64(restaurant.photo1Url);
    doc.addImage(base64Image, "JPEG", 150, y + 5, 45, 35); // 이미지 크기와 위치 조정

    y += 60; // 다음 섹션으로 이동
  }
}

      // 총계 및 비고
  
      y += 20;
      doc.rect(10, y, 190, 20);
      doc.text("비고", 12, y + 5);

      y += 30; // 마지막 여백

// 결재란을 항상 페이지의 오른쪽 하단에 표시
const boxWidth = 90; // 결재란 전체의 가로 길이
const boxHeight = 30; // 결재란 전체의 세로 길이
const startX = doc.internal.pageSize.width - boxWidth - 10; // 오른쪽 하단에서 10mm 여백
const startY = doc.internal.pageSize.height - boxHeight - 10; // 아래에서 10mm 여백

// 사각형 그리기 - 결재란 전체 박스
doc.rect(startX, startY, boxWidth, boxHeight);

// 세로 라인 그리기 (작성자, 팀장, 상무, 센터장을 나누는 선)
// '결'과 '재' 사이의 선을 그리지 않음
const columnWidth = (boxWidth - 20) / 3; // '결재' 칸을 제외한 나머지 4칸으로 나누기
for (let i = 1; i < 5; i++) {
    doc.line(startX + 20 + columnWidth * (i - 1), startY, startX + 20 + columnWidth * (i - 1), startY + boxHeight);
}

// 가로 라인 그리기 (결재와 나머지 텍스트를 구분하는 선)
doc.line(startX + 20, startY + boxHeight / 2, startX + boxWidth, startY + boxHeight / 2); // 결과 재 사이의 선을 시작점으로 사용하지 않음

// 텍스트 추가
doc.setFontSize(10);

// '결재' 텍스트 추가 (세로로 정렬)
doc.text("결", startX + 7, startY + 10);  
doc.text("재", startX + 7, startY + 20);  

// 각 칸에 텍스트 추가
const roles = ["작성자", "팀장", "상무"];
roles.forEach((role, index) => {
    const textWidth = doc.getTextWidth(role);
    const xPosition = startX + 20 + columnWidth * index + (columnWidth - textWidth) / 2;
    const yPosition = startY + boxHeight / 2 - 5; // '결' 텍스트의 높이에 맞추기 위해 위치 조정
    doc.text(role, xPosition, yPosition);
});


      // PDF 저장
      doc.save("회식_신청보고서.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <button onClick={generatePDF} className="generate-pdf-btn">
      PDF로 서류 양식받기
    </button>
  );
};

export default PDFExportButton;

