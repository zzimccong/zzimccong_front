import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import pay_success from '../../../../assets/icons/pay_success.png';
import './Success.css';


export function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  
  useEffect(() => {
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),

    };

    async function confirm() {
      const response = await fetch("/api/pay/success", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        
        navigate(`/fail?message=${json.message}&code=${json.code}`);
        return;
      }

      
    }
    confirm();
  }, []);

  return (
      <div className="success-container">
        <img src={pay_success} className="pay-success-img"/>
        <span className="pay-success-text"> 결제 성공 했어요! </span>
        <p>{`결제 금액: ${Number(searchParams.get("amount")).toLocaleString()}원`}</p>
        <button onClick={() => navigate('/user/coupon')}  className="pay-success-btn">
            돌아가기
          </button>
        
      </div>
  );
}

export default Success;
