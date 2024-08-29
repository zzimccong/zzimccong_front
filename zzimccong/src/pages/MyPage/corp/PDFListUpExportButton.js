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
    return response.data; 
  } catch (error) {
    console.error("이미지 로드 에러:", error);
    throw error;
  }
};

const PDFListUpExportButton = ({ reservations, restaurantDetails }) => {
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

  const splitTextToFitWidth = (doc, text, maxWidth) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    return lines.join("\n");
  };

  const generatePDF = async () => {
    try {
        const base64Font = await loadFont();
        const doc = new jsPDF("landscape");  

        doc.addFileToVFS("NotoSansKR-Regular.ttf", base64Font);
        doc.addFont("NotoSansKR-Regular.ttf", "NotoSansKR", "normal");
        doc.setFont("NotoSansKR", "normal");
        doc.setFontSize(10); 

        let y = 10; 
        const cellPadding = 5;
        const headerHeight = 20; 
        const cellHeight = 60; 
        const imageWidth = 50; 
        const imageHeight = 50; 
        const columnWidths = [60, 35, 35, 35, 30, 45]; 

        // 테이블 헤더 생성
        const headers = ['사진', '레스토랑 이름', '카테고리', '주소', '전화번호', '웹사이트'];
        let x = 10; // X 좌표 시작 위치

        headers.forEach((header, index) => {
            doc.text(header, x + cellPadding, y + cellPadding);
            doc.rect(x, y, columnWidths[index], headerHeight);
            x += columnWidths[index];
        });

        y += headerHeight; // 다음 행으로 이동

        // 테이블 내용 생성
        for (const reservation of reservations) {
            const restaurant = restaurantDetails[reservation.restaurantId];
            if (restaurant) {
                x = 10; // X 좌표 초기화
                const base64Image = await loadImageAsBase64(restaurant.photo1Url);
                
                // 이미지 셀 추가
                doc.addImage(base64Image, 'JPEG', x + cellPadding, y + (cellHeight - imageHeight) / 2, imageWidth, imageHeight);
                doc.rect(x, y, columnWidths[0], cellHeight);
                x += columnWidths[0];

                // 레스토랑 이름 셀 추가
                const restaurantName = splitTextToFitWidth(doc, restaurant.name, columnWidths[1] - cellPadding * 2);
                doc.text(restaurantName, x + cellPadding, y + cellPadding + 10);
                doc.rect(x, y, columnWidths[1], cellHeight);
                x += columnWidths[1];

                // 카테고리 셀 추가
                const category = splitTextToFitWidth(doc, restaurant.category, columnWidths[2] - cellPadding * 2);
                doc.text(category, x + cellPadding, y + cellPadding + 10);
                doc.rect(x, y, columnWidths[2], cellHeight);
                x += columnWidths[2];

                // 주소 셀 추가
                const address = splitTextToFitWidth(doc, getShortenedAddress(restaurant.roadAddress), columnWidths[3] - cellPadding * 2);
                doc.text(address, x + cellPadding, y + cellPadding + 10);
                doc.rect(x, y, columnWidths[3], cellHeight);
                x += columnWidths[3];

                // 전화번호 셀 추가
                const phoneNumber = splitTextToFitWidth(doc, restaurant.phoneNumber, columnWidths[4] - cellPadding * 2);
                doc.text(phoneNumber, x + cellPadding, y + cellPadding + 10);
                doc.rect(x, y, columnWidths[4], cellHeight);
                x += columnWidths[4];

                // 웹사이트 셀 추가
                const link = splitTextToFitWidth(doc, restaurant.link, columnWidths[5] - cellPadding * 2);
                doc.text(link, x + cellPadding, y + cellPadding + 10);
                doc.rect(x, y, columnWidths[5], cellHeight);

                y += cellHeight; // 다음 행으로 이동
            }
        }

        doc.save("listup_양식.pdf");
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};


  return (
    <button onClick={generatePDF} className="generate-pdf-btn">
      PDF로 리스트업 양식 받기
    </button>
  );
};

export default PDFListUpExportButton;
