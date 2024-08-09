import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import useCurrentUser from "../../../../hooks/useCurrentUser";
import axios from '../../../../utils/axiosConfig'; // axios 인스턴스 설정

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "j6Grr3qHuH_b6nF-SwQKU";

export function Payment({ Amount }) {
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: Number(Amount),
  });

  const [ready, setReady] = useState(false);
  const [tossPayments, setTossPayments] = useState(null);
  const [widgets, setWidgets] = useState(null);

  useEffect(() => {
    // // TossPayments 초기화
    // const initializeTossPayments = async () => {
    //   try {
    //     const toss = await loadTossPayments(clientKey);
    //     setTossPayments(toss);
    //   } catch (error) {
    //     console.error("TossPayments initialization failed:", error);
    //   }
    // };

    // initializeTossPayments();
    async function fetchPaymentWidget() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({
        customerKey,
      });

      setTossPayments(tossPayments);
      setWidgets(widgets);
    }
    fetchPaymentWidget();
  }, [clientKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null){
        return;
      }
      // ------ 주문의 결제 금액 설정 ------
    await widgets.setAmount(amount);

    await Promise.all([
      // ------  결제 UI 렌더링 ------
      widgets.renderPaymentMethods({
        selector: "#payment-method",
        variantKey: "DEFAULT",
      }),
      // ------  이용약관 UI 렌더링 ------
      widgets.renderAgreement({
        selector: "#agreement",
        variantKey: "AGREEMENT",
      }),
    ]);
      setReady(true);
    }
    renderPaymentWidgets();
  },[widgets]);

  useEffect(() => {
    if (widgets == null) {
      return;
    }
  
    widgets.setAmount(amount);
  }, [widgets, amount]);
  

  //현재 로그인된 정보
  const user = useCurrentUser();

  const payment = async () => {
    const body = {
      payType: 'CARD',
      amount: amount.value,
      userId: user.id,
      orderName: '예약권 1매',
      yourSuccessUrl: `http://localhost:3000/success`,
      yourFailUrl: `http://localhost:3000/fail`,
    };

    console.log("전송 객체 ",body);

    try {
      const res = await axios.post('/api/pay', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = res.data;

      console.log("받은 객체 ", data);

      console.log("amount ", typeof(data.payType));

      await widgets.requestPayment({
        //amount: data.amount,
        orderId: data.orderId,
        orderName: data.orderName,
        customerName: data.customerName,
        successUrl: data.successUrl,
        failUrl: data.failUrl,
        customerEmail: data.customerEmail,
      });
    } catch (error) {
      if (error.response) {
        console.error("Server responded with status code:", error.response.status);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Error in setting up request:", error.message);
      }
      console.error("Error config:", error.config);
    }
  };

  return (
    
    <div className="wrapper">
      <div className="box_section">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />

        <div>
          <button onClick={payment} disabled={!ready}>
            결제하기
          </button>
        </div>
      </div>
    </div>

  );
}

export default Payment;
