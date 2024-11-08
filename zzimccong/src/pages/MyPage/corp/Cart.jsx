import jsPDF from "jspdf";
import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import ReservationCalendar from '../../Calendar/ReservationCalendar';
import PDFExportButton from './PDFExportButton';
import PDFListUpExportButton from './PDFListUpExportButton';
import logo from '../../../assets/icons/logo.png';
import Modal from 'react-modal';
import './Cart.css';

// Modal.setAppElement('#root');

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
    const [showPdfOptions, setShowPdfOptions] = useState(false);


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

    const togglePdfOptions = () => {
        setShowPdfOptions(!showPdfOptions);
    };

    return (
        <div>
          <div className="header">
            <img src={logo} className="logo" />
            <div className="searchcomponent_title">장바구니</div>
          </div>
          <div className="Cart-items">
                {cartItems.length > 0 ? (
                    <div>
                        <div style={{display:"flex", margin:'10px'}}>
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
                            <label style={{display:"flex", marginLeft:'10px'}} >전체선택</label>
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
                                        style={{marginLeft:'8px'}}
                                        checked={selectedItems.includes(cart.restaurant.id)}
                                        onChange={() => handleSelectItem(cart.restaurant.id)}
                                        onClick={(e) => e.stopPropagation()} 
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
                                        <button 
                                            className="Cart-reservation"
                                            onClick={(e) => {e.stopPropagation();
                                                handleReservationClick(cart.restaurant.id);}} >
                                            예약하기
                                        </button>
                                    </div>
                                </div>
                                <hr style={{ width: '435px', margin: 'auto' }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='Cart-empty'>장바구니가 비어 있습니다.</div>
                )}
            </div>
            <div className="Cart-footer">
            <div className="pdf-options">
                    {showPdfOptions && (
                        <div className="pdf-buttons">
                            <PDFExportButton
                                reservations={cartItems
                                    .filter(item => selectedItems.includes(item.restaurant.id))
                                    .map(item => ({
                                        restaurantId: item.restaurant.id,
                                        reservationTime: new Date().toISOString() // 임시로 현재 시간 설정
                                    }))}
                                restaurantDetails={cartItems
                                    .filter(item => selectedItems.includes(item.restaurant.id))
                                    .reduce((acc, item) => {
                                        acc[item.restaurant.id] = item.restaurant;
                                        return acc;
                                    }, {})}
                            />

                            <PDFListUpExportButton
                                reservations={cartItems
                                    .filter(item => selectedItems.includes(item.restaurant.id))
                                    .map(item => ({ restaurantId: item.restaurant.id }))}
                                restaurantDetails={cartItems
                                    .filter(item => selectedItems.includes(item.restaurant.id))
                                    .reduce((acc, item) => {
                                        acc[item.restaurant.id] = item.restaurant;
                                        return acc;
                                    }, {})}
                            />
                        </div>
                    )}
                    <button className="Cart-pdf-button" onClick={togglePdfOptions}>
                        {showPdfOptions ? '닫기' : '문서화'}
                    </button>
                </div>

                <button className="Cart-cancel-button" onClick={handleCancel}>삭제</button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                className="RestaurantDetail-Modal"
                overlayClassName="RestaurantDetail-Overlay"
            >
                {selectedRestaurantId && (
                    <ReservationCalendar restaurantId={selectedRestaurantId} />
                )}
                <button onClick={() => setModalIsOpen(false)} className="RestaurantDetail-close-modal">
                    닫기
                </button>
            </Modal>
        </div>
        
      );
}

export default Cart;
