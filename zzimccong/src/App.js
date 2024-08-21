import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import Account from './pages/MyPage/Account.jsx';
import Search from './pages/Search/Searchcomponent.jsx';
import Login from './components/login/Login.jsx';
import Register from './components/register/Register.jsx';
import MyPage from './pages/MyPage/MyPage.jsx';
import CorpEdit from './pages/MyPage/corp/CorpEdit .jsx';
import Cart from './pages/MyPage/corp/Cart.jsx';
import UserEdit from './pages/MyPage/user/UserEdit .jsx';
import UserCoupon from './pages/MyPage/user/coupon/UserCoupon.jsx';
import ReservationCoupon from './pages/MyPage/user/coupon/ReservationCoupon.jsx';
import LotteryCoupon from './pages/MyPage/user/coupon/LotteryCoupon.jsx';
import Payment from './pages/MyPage/user/payment/Payment.jsx';
import Success from './pages/MyPage/user/payment/Success.jsx';
import Fail from './pages/MyPage/user/payment/Fail.jsx';
import PaymentHistory from './pages/MyPage/user/payment/PaymentHistory.jsx';
import ChangePassword from './components/login/changePassword/ChangePassword.jsx';
import KakaoCallBack from './components/login/kakao/KakaoCallBack.jsx';
import KakaoUser from './pages/MyPage/kakao/KakaoUser.jsx';
import FindId from './components/login/find/FindId.jsx';
import FindPassword from './components/login/find/FindPassword.jsx';
import { AuthProvider } from './context/AuthContext.js';
import Map from './pages/Map/Map';
import RestaurantForm from './pages/Restaurant/RestaurantCreateForm';
import AdminRestaurantList from './pages/Restaurant/AdminRestaurantList';
import ReservationCalendar from './pages/Calendar/ReservationCalendar';
import Restaurants from './pages/Restaurant/Restaurants';
import RestaurantDetail from './pages/Restaurant/RestaurantDetail';
import DiscountCoupon from './pages/MyPage/user/coupon/DiscountCoupon.jsx';
import MyReservations from './pages/Reservation/MyReservations.jsx';
import EditReservationStatus from './pages/Reservation/EditReservationStatus.jsx';
import RestaurantEditForm from './pages/Restaurant/RestaurantEditForm.jsx';
import ManagerRestaurantList from './pages/Restaurant/ManagerRestaurantList.jsx';
import Visit from './pages/MyPage/review/Visit.jsx';
import ReviewList from './pages/MyPage/review/ReviewList.jsx';
import UserManagement from './pages/MyPage/admin/user/UserManagement.jsx';
import CorpManagement from './pages/MyPage/admin/corp/CorpManagement.jsx';
import AdminUserEdit from './pages/MyPage/admin/user/AdminUserEdit.jsx';
import AdminCorpEdit from './pages/MyPage/admin/corp/AdminCorpEdit.jsx';


function App() {

  const [Amount, setAmount] = useState(0);
  const [CouponType, setCouponType] = useState("");


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

            {/* 검색 */}
            <Route path="/search" element={<Search />} />
            

            {/* 쿠폰 */}
            <Route path="/user/coupon" element={<UserCoupon setAmount={setAmount} setCouponType={setCouponType} />} />
            <Route path="/user/coupon/reservation" element={<ReservationCoupon />} />
            <Route path="/user/coupon/lottery" element={<LotteryCoupon />} />
            <Route path="/user/coupon/discount" element={<DiscountCoupon />} />

            {/* 장바구니 */}
            <Route path="/corp/cart" element={<Cart />} />


            {/* 결제 */}
            <Route path="/payment" element={<Payment Amount={Amount} CouponType={CouponType} />} />
            <Route path="/payment/success" element={<Success />} />
            <Route path="/payment/fail" element={<Fail />} />
            <Route path="/paymenthistory" element={<PaymentHistory />} />

            {/* 방문내역 */}
            <Route path="visited" element={<Visit/>} />
            <Route path="/reviewList" element={<ReviewList/>} />

            <Route path="/oauth2/callback/kakao" element={<KakaoCallBack />} />
            <Route path="/kakao-user" element={<KakaoUser />} />

            <Route path="/find-id" element={<FindId />} />
            <Route path="/find-password" element={<FindPassword />} />

            <Route path="/reservationCalendar" element={<ReservationCalendar />} />
            {/* 네이버 지도 */}
            <Route path="/map" element={<Map />} />

            {/* 예약 캘린더 */}
            <Route path="/reservationCalendar" element={<ReservationCalendar />} />

            {/* 가게 전체 조회 */}
            <Route path="/restaurants" element={<Restaurants />} />
            {/* 가게 상세정보 */}
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            {/* 사용자 예약조회 */}
            <Route path="/myReservation" element={<MyReservations />} />
            {/* 예약 상태 수정(점주) */}
            <Route path="/reservations" element={<EditReservationStatus />} />
            {/* 가게 생성 (사용자) */}
            <Route path="/restaurantCreate" element={<RestaurantForm />} />
            {/* 가게 정보 수정(점주) */}
            <Route path="/restaurantUpdate/:id" element={<RestaurantEditForm />} />
            {/* 가게 전체 조회(관리자) */}
            <Route path="/admin/restaurants" element={<AdminRestaurantList />} />
            {/* 가게 전체 조회(점주) */}
            <Route path="/manager/restaurants" element={<ManagerRestaurantList />} />

            {/* 사용자 전체 조회 */}
            <Route path="/user-management" element={<UserManagement />} />
            {/* 기업 사용자 전체 조회 */}
            <Route path="/corp-management" element={<CorpManagement />} />

            <Route path="/edit-user/:id" element={<AdminUserEdit />} />
            <Route path="/edit-corp/:id" element={<AdminCorpEdit />} />
        
          </Routes>
          <Navbar />
        </Router>
      </AuthProvider>

    </div>
  );
}

export default App;
