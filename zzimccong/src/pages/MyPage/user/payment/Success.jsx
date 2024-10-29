import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import pay_success from '../../../../assets/icons/pay_success.png';
import axios from '../../../../utils/axiosConfig';
import './Success.css';


export function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paySuccessData, setPaySuccessData] = useState(false);
  
  useEffect(() => {

    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);

    const paymentData = localStorage.getItem('paymentData');
    const parsedData = paymentData ? JSON.parse(paymentData) : null;
  
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
      orderName: parsedData.orderName,
      userId: user.id,
    };

    console.log("parsedData : ", parsedData);
    setPaySuccessData(parsedData);
    localStorage.removeItem('paymentData');

    const postData = async () => {

      await axios.post('/api/pay/success', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    };

    postData();
  }, [searchParams]);

  const handledone = () => {
    navigate('/user/coupon');
  }

  return (
      <div className="success-container">
        <img src={pay_success} className="pay-success-img"/>
        <span className="pay-success-text"> 결제 성공 했어요! </span>
        
        <p>{`결제 내역: ${paySuccessData.orderName}`}</p> 
        <p>{`결제 금액: ${Number(paySuccessData.amount).toLocaleString()}원`}</p> 
        <button onClick={handledone}  className="pay-success-btn">
            돌아가기
        </button>
        
      </div>
  );
}

export default Success;
