import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import './RestaurantForm.css'; // 추가된 CSS 파일을 import

function RestaurantForm() {
  const [restaurant, setRestaurant] = useState({
    name: '',
    category: '',
    roadAddress: '',
    numberAddress: '',
    phoneNumber: '',
    detailInfo: '',
    businessHours: '',
    link: '',
    facilities: '',
    parkingInfo: '',
    mainPhotoUrl: '',
    photo1Url: '',
    photo2Url: '',
    photo3Url: '',
    photo4Url: '',
    photo5Url: '',
    latitude: '',
    longitude: '',
    seats: '',
  });

  // useEffect를 사용하여 Daum 주소 API 스크립트를 동적으로 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurant(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const fetchGeocode = async (roadAddress) => {
    try {
      const response = await axios.get('/api/geocode', {
        params: { query: roadAddress },
      });

      console.log(response.data); // 응답 데이터를 콘솔에 출력하여 확인

      const { addresses } = response.data;
      if (addresses.length > 0) {
        const { x, y } = addresses[0]; // x = longitude, y = latitude
        setRestaurant(prevState => ({
          ...prevState,
          latitude: y,
          longitude: x
        }));
      } else {
        console.error('No addresses found');
      }
    } catch (error) {
      console.error('Error fetching geocode:', error);
    }
  };

  // 다음 주소 API 호출 함수
  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let fullRoadAddr = data.roadAddress; // 도로명 주소 변수
        let extraRoadAddr = ''; // 참고 항목 변수

        // 참고항목 조합
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
        }
        if (extraRoadAddr !== '') {
          fullRoadAddr += ' (' + extraRoadAddr + ')';
        }

        // 도로명 주소를 상태에 업데이트
        setRestaurant(prevState => ({
          ...prevState,
          roadAddress: fullRoadAddr,
          numberAddress: data.jibunAddress
        }));

        // 도로명 주소를 기반으로 Geocode API 호출
        fetchGeocode(fullRoadAddr);
      }
    }).open();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(restaurant); // 폼이 제출되기 전의 restaurant 객체를 콘솔에 출력

    axios.post('/api/restaurantCreate', restaurant)
      .then(response => {
        alert('Restaurant created successfully');
      })
      .catch(error => {
        console.error('There was an error creating the restaurant!', error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="restaurant-form">
      <h2>찜콩테이블 입점 문의</h2>
      <p>매장 정보와 문의사항을 남겨주세요. 영업일 기준 평균 2일 내에 연락드려요.</p>

      <div className="form-group">
        <label>상호명</label>
        <input type="text" name="name" value={restaurant.name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>업종</label>
        <input type="text" name="category" value={restaurant.category} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>도로명 주소</label>
        <input type="text" name="roadAddress" value={restaurant.roadAddress} onChange={handleChange} required />
        <button type="button" onClick={handlePostcode}>주소 검색</button>
      </div>

      <div className="form-group">
        <label>지번 주소</label>
        <input type="text" name="numberAddress" value={restaurant.numberAddress} onChange={handleChange}/>
      </div>

      <div className="form-group">
        <label>전화번호</label>
        <input type="text" name="phoneNumber" value={restaurant.phoneNumber} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>상세정보</label>
        <textarea name="detailInfo" value={restaurant.detailInfo} onChange={handleChange}></textarea>
      </div>

      <div className="form-group">
        <label>영업시간</label>
        <input type="text" name="businessHours" value={restaurant.businessHours} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>링크</label>
        <input type="text" name="link" value={restaurant.link} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>편의시설</label>
        <input type="text" name="facilities" value={restaurant.facilities} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>주차정보</label>
        <input type="text" name="parkingInfo" value={restaurant.parkingInfo} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>메인 사진 URL</label>
        <input type="text" name="mainPhotoUrl" value={restaurant.mainPhotoUrl} onChange={handleChange} />
      </div>

      {[1, 2, 3, 4, 5].map((num) => (
        <div className="form-group" key={num}>
          <label>사진{num} URL</label>
          <input
            type="text"
            name={`photo${num}Url`}
            value={restaurant[`photo${num}Url`]}
            onChange={handleChange}
          />
        </div>
      ))}

      <div className="form-group">
        <label>좌석 정보</label>
        <input type="text" name="seats" value={restaurant.seats} onChange={handleChange} />
      </div>

      <button type="submit" className="submit-button">가게 등록</button>
    </form>
  );
}

export default RestaurantForm;
