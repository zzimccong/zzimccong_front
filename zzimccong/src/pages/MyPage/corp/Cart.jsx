import jsPDF from "jspdf";
import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import ReservationCalendar from '../../Calendar/ReservationCalendar';
import Modal from 'react-modal';
import './Cart.css';

Modal.setAppElement('#root');

const loadFont = async () => {
  try {
    const response = await fetch('/font/NotoSansKR-Regular.ttf');
    if (!response.ok) {
      throw new Error('Failed to fetch font file.');
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
    const response = await axios.get('/api/image-to-base64', {
      params: { url: imageUrl },
    });
    return response.data; // Base64 이미지 데이터
  } catch (error) {
    console.error('이미지 로드 에러:', error);
    throw error;
  }
};

function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`api/cart/${user.id}`);
                setCartItems(response.data);
                console.log(response.data);
            } catch (err) {
                console.error('장바구니 결과 오류 발생: ', err);
            }
        };
        fetchCartItems();
    }, []);

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map((item) => item.restaurant.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectItem = (restaurantId) => {
        if (selectedItems.includes(restaurantId)) {
            setSelectedItems(selectedItems.filter((itemId) => itemId !== restaurantId));
        } else {
            setSelectedItems([...selectedItems, restaurantId]);
        }
    };

    const splitTextToFitWidth = (doc, text, maxWidth) => {
        if (doc.getTextWidth(text) > maxWidth) {
            return doc.splitTextToSize(text, maxWidth);
        }
        return text;
    };

    const generatePDF = async () => {
        try {
            const base64Font = await loadFont();
            const doc = new jsPDF("landscape");  // 가로 형식으로 설정

            doc.addFileToVFS("NotoSansKR-Regular.ttf", base64Font);
            doc.addFont("NotoSansKR-Regular.ttf", "NotoSansKR", "normal");
            doc.setFont("NotoSansKR", "normal");
            doc.setFontSize(10); // 폰트 크기 조정

            let y = 10; // Y 좌표 시작 위치
            const cellPadding = 5;
            const headerHeight = 20; // 1행의 높이
            const cellHeight = 60; // 셀 높이 조정
            const imageWidth = 50; // 이미지 너비 조정 (크게 조정)
            const imageHeight = 50; // 이미지 높이 조정 (크게 조정)
            const columnWidths = [60, 35, 35, 35, 30, 45]; // 사진 열 너비를 넓히고 나머지 열 너비를 줄임

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
            for (const cartItem of cartItems) {
                if (selectedItems.includes(cartItem.restaurant.id)) {
                    x = 10; // X 좌표 초기화
                    const base64Image = await loadImageAsBase64(cartItem.restaurant.photo1Url);
                    
                    // 이미지 셀 추가
                    doc.addImage(base64Image, 'JPEG', x + cellPadding, y + (cellHeight - imageHeight) / 2, imageWidth, imageHeight);
                    doc.rect(x, y, columnWidths[0], cellHeight);
                    x += columnWidths[0];

                    // 레스토랑 이름 셀 추가
                    const restaurantName = splitTextToFitWidth(doc, cartItem.restaurant.name, columnWidths[1] - cellPadding * 2);
                    doc.text(restaurantName, x + cellPadding, y + cellPadding + 10);
                    doc.rect(x, y, columnWidths[1], cellHeight);
                    x += columnWidths[1];

                    // 카테고리 셀 추가
                    const category = splitTextToFitWidth(doc, cartItem.restaurant.category, columnWidths[2] - cellPadding * 2);
                    doc.text(category, x + cellPadding, y + cellPadding + 10);
                    doc.rect(x, y, columnWidths[2], cellHeight);
                    x += columnWidths[2];

                    // 주소 셀 추가
                    const address = splitTextToFitWidth(doc, cartItem.restaurant.roadAddress, columnWidths[3] - cellPadding * 2);
                    doc.text(address, x + cellPadding, y + cellPadding + 10);
                    doc.rect(x, y, columnWidths[3], cellHeight);
                    x += columnWidths[3];

                    // 전화번호 셀 추가
                    const phoneNumber = splitTextToFitWidth(doc, cartItem.restaurant.phoneNumber, columnWidths[4] - cellPadding * 2);
                    doc.text(phoneNumber, x + cellPadding, y + cellPadding + 10);
                    doc.rect(x, y, columnWidths[4], cellHeight);
                    x += columnWidths[4];

                    // 웹사이트 셀 추가
                    const link = splitTextToFitWidth(doc, cartItem.restaurant.link, columnWidths[5] - cellPadding * 2);
                    doc.text(link, x + cellPadding, y + cellPadding + 10);
                    doc.rect(x, y, columnWidths[5], cellHeight);

                    y += cellHeight; // 다음 행으로 이동
                }
            }

            doc.save("cart.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    const handlePaper = () => {
        generatePDF();
    };

    const handleCancel = async () => {
        const confirmDelete = window.confirm('선택한 항목을 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                const deleteItems = {
                    userId: user.id,
                    storeIds: selectedItems
                };
                console.log("전송 객체 ", deleteItems);
                const response = await axios.post('/api/cart/delete', deleteItems, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    console.log('삭제 성공:', response.data);
                    setCartItems(cartItems.filter(item => !selectedItems.includes(item.restaurant.id)));
                    setSelectedItems([]);
                } else {
                    console.error('삭제 실패:', response.data);
                }
            } catch (err) {
                console.error('삭제 중 오류 발생:', err);
            }
        }
    };

    const navigateToStoreDetails = (storeId) => {
        navigate(`/restaurant/${storeId}`);
    };

    const getShortAddress = (address) => {
        const parts = address.split(' ');
        return parts.slice(0, 2).join(' ');
    };

    const handleReservationClick = (restaurantId) => {
        setSelectedRestaurantId(restaurantId);
        setModalIsOpen(true);
    };

    return (
        <div>
            <div className="header">
                <div className="title">장바구니</div>
            </div>
            <div className="cart-items">
                {cartItems.length > 0 ? (
                    <div>
                        <div>
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
                            <label>전체선택</label>
                        </div>
                        {cartItems.map((cart) => (
                            <div
                                key={cart.id}
                                className="store-item p-4 mb-4 rounded-lg"
                                style={{ maxWidth: '700px' }}
                                onClick={() => navigateToStoreDetails(cart.restaurant.id)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(cart.restaurant.id)}
                                        onChange={() => handleSelectItem(cart.restaurant.id)}
                                        onClick={(e) => e.stopPropagation()} // 이미지 클릭과 체크박스 클릭을 분리
                                    />
                                    <img
                                        src={cart.restaurant.photo1Url}
                                        alt={`${cart.name} 사진`}
                                        className="restaurant-image"
                                        style={{ margin: '10px', width: '100px', height: '100px' }}
                                    />
                                    <div className="restaurant-info" style={{ flexGrow: 1 }}>
                                        <div className="restaurant-name text-10px font-bold">
                                            {cart.restaurant.name}
                                        </div>
                                        <div className="restaurant-category">
                                            {cart.restaurant.category} / {getShortAddress(cart.restaurant.roadAddress)}
                                        </div>
                                        <div>
                                            {cart.restaurant.phoneNumber}
                                        </div>
                                        <div>
                                            {cart.restaurant.link}
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    className="reservation"
                                    onClick={(e) => {e.stopPropagation();
                                        handleReservationClick(cart.restaurant.id);}} >
                                    예약하기
                                </button>
                                <hr style={{ width: '435px', margin: 'auto' }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>장바구니가 비어 있습니다.</div>
                )}
            </div>
            <div className="footer">
                <button className="reserve-button" onClick={handlePaper}>문서화</button>
                <button className="cancel-button" onClick={handleCancel}>삭제</button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                className="Modal"
                overlayClassName="Overlay"
            >
                {selectedRestaurantId && (
                    <ReservationCalendar restaurantId={selectedRestaurantId} />
                )}
                <button onClick={() => setModalIsOpen(false)} className="close-modal">
                    닫기
                </button>
            </Modal>
        </div>
    );
}

export default Cart;
