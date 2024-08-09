import React,{useState} from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import Account from './pages/MyPage/Account.jsx';
import Login from './components/login/Login.jsx';
import Register from './components/register/Register.jsx';
import MyPage from './pages/MyPage/MyPage.jsx';
import CorpEdit from './pages/MyPage/corp/CorpEdit .jsx';
import UserEdit from './pages/MyPage/user/UserEdit .jsx';
import UserCoupon from './pages/MyPage/user/coupon/UserCoupon.jsx';
import Payment from './pages/MyPage/user/coupon/Payment.jsx';
import Success from './pages/MyPage/user/coupon/Success.jsx';
import Fail from './pages/MyPage/user/coupon/Fail.jsx';
import ChangePassword from './components/login/changePassword/ChangePassword.jsx';
import KakaoCallBack from './components/login/kakao/KakaoCallBack.jsx';
import KakaoUser from './pages/MyPage/kakao/KakaoUser.jsx';
import FindId from './components/login/find/FindId.jsx';
import FindPassword from './components/login/find/FindPassword.jsx';
import { AuthProvider } from './context/AuthContext.js';
import ReservationCalendar from './pages/Calendar/ReservationCalendar';
import Restaurants from './pages/Restaurant/Restaurants';
import RestaurantDetail from './pages/Restaurant/RestaurantDetail';


function App() {

  const [Amount, setAmount] = useState(0);

  return (
    <div>
      <AuthProvider>
        <Router>
          <Header />
          <Routes>

            {/* 메인화면 */}
            <Route path="/" element={<Home />} />

            {/* 계정 */}
            <Route path="/account" element={<Account />} />

            {/* 로그인 */}
            <Route path="/login" element={<Login />} />

            {/* 회원가입 */}
            <Route path="/register" element={<Register />} />

            {/* 마이페이지 */}
            <Route path="/myPage" element={<MyPage />} />

            {/* 내 정보 수정 */}
            <Route path="/corporation/edit" element={<CorpEdit />} />
            <Route path="/users/edit" element={<UserEdit />} />

            {/* 비밀번호 변경 */}
            <Route path="/change-password" element={<ChangePassword />} />


            {/* 쿠폰 결제 */}
            <Route path="/user/coupon" element={<UserCoupon setAmount={setAmount} />} />
            <Route path="/payment" element={<Payment Amount={Amount}/>} />
            <Route path="/success" element={<Success/>} />
            <Route path="/fail" element={<Fail/>} />



            <Route path="/oauth2/callback/kakao" element={<KakaoCallBack />} />
            <Route path="/kakao-user" element={<KakaoUser />} />

            <Route path="/find-id" element={<FindId />} />
            <Route path="/find-password" element={<FindPassword />} />

            <Route path="/reservationCalendar" element={<ReservationCalendar/>} />

            <Route path="/restaurants" element={<Restaurants/>} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} /> 

          </Routes>
          <Navbar />
        </Router>
      </AuthProvider>

    </div>
  );
}

export default App;
