import React, { useEffect, useState } from 'react';
import axios from '../../../../utils/axiosConfig';
import logo from '../../../../assets/icons/logo.png';
import './PaymentHistory.css';


function PaymentHistory() {

    const [payHistory, setPayHistory] = useState([]);

    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);

    useEffect(() => {
        const fetchCartItems = async () =>{

            try {
                const response = await axios.get(`api/pay/history/${user.id}`);
                setPayHistory(response.data);
                // console.log(response.data);
            } catch (err) {
                console.error('결제내역 결과 오류 발생: ', err);
            }
        };
        fetchCartItems();
    }, []);


    return (

        <div>
            <div className="header">
                <img src={logo} className="logo" />
                <div className="PaymentHistory-title">결제 내역</div>
            </div>
            <div>
                {payHistory.map((item, index) => (
                    <div key={index} className="PaymentHistory-item">
                        <div className="PaymentHistory-info">
                            <div className="PaymentHistory-name">{item.orderName}</div>
                            <div className="PaymentHistory-date">{new Date(item.paymentDate).toLocaleDateString()}</div>
                        </div>
                            <div className="PaymentHistory-amount">{item.amount.toLocaleString()}원</div>
                    </div>
                ))}
            </div>
        </div>
      );
};

export default PaymentHistory;