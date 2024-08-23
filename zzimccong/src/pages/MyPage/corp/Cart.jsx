import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axiosConfig';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import ReservationCalendar from '../../Calendar/ReservationCalendar';
import Modal from 'react-modal';
import'./Cart.css';

Modal.setAppElement('#root');

=======
import { useNavigate } from 'react-router-dom'
import'./Cart.css';

>>>>>>> 65cebdfd558180da22893dba380ce4132d29e008
function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
<<<<<<< HEAD
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
=======

>>>>>>> 65cebdfd558180da22893dba380ce4132d29e008

    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);

    useEffect(() => {
        const fetchCartItems = async () =>{

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

    const handlePaper = () => {
        console.log('문서화 처리:', selectedItems);
    };

    const handleCancel = async () => {
      const confirmDelete = window.confirm('선택한 항목을 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
              const deleteItems = {
                userId: user.id,
                storeIds: selectedItems
              };
              console.log("전송 객체 ",deleteItems);
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
  
      //주소 파싱                                      
      const getShortAddress = (address) => {
        const parts = address.split(' ');  
        return parts.slice(0, 2).join(' ');  
    };

<<<<<<< HEAD
    const handleReservationClick = (restaurantId) => {
        setSelectedRestaurantId(restaurantId);
        setModalIsOpen(true);
      };

=======
>>>>>>> 65cebdfd558180da22893dba380ce4132d29e008
   
    return (
        <div>
          <div className="header">
            {/* <img src={logoImage} className="logo" /> */}
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
<<<<<<< HEAD
                                        style={{ margin: '10px', width: '100px', height: '100px' }}
                                    />
                                    <div className="restaurant-info" style={{ flexGrow: 1 }}>
                                        <div className="restaurant-name text-10px font-bold">
=======
                                        style={{ margin: '10px', width: '120px', height: '120px' }}
                                    />
                                    <div className="restaurant-info" style={{ flexGrow: 1 }}>
                                        <div className="restaurant-name text-xl font-bold">
>>>>>>> 65cebdfd558180da22893dba380ce4132d29e008
                                            {cart.restaurant.name}
                                        </div>
                                        <div className="restaurant-category">
                                            {cart.restaurant.category} / {getShortAddress(cart.restaurant.roadAddress)}
                                        </div>
                                    </div>
                                </div>
<<<<<<< HEAD
                                <button 
                                    className="reservation"
                                    onClick={(e) => {e.stopPropagation();
                                        handleReservationClick(cart.restaurant.id);}} >
                                    예약하기
                                </button>
=======
>>>>>>> 65cebdfd558180da22893dba380ce4132d29e008
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
<<<<<<< HEAD
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
=======
>>>>>>> 65cebdfd558180da22893dba380ce4132d29e008
        </div>
      );
}

export default Cart;