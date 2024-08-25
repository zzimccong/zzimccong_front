import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import './RestaurantForm.css'; // 추가된 CSS 파일을 import

function RestaurantCreateForm () {
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
    mainPhotoFile: null,
    photo1File: null,
    photo2File: null,
    photo3File: null,
    photo4File: null,
    photo5File: null,
    latitude: '',
    longitude: '',
    seats: '',
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurant(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setRestaurant(prevState => ({
      ...prevState,
      [name]: files[0]
    }));
  };

  const fetchGeocode = async (roadAddress) => {
    try {
      const response = await axios.get('/api/geocode', {
        params: { query: roadAddress },
      });

      console.log(response.data);

      const { addresses } = response.data;
      if (addresses.length > 0) {
        const { x, y } = addresses[0];
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

  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let fullRoadAddr = data.roadAddress;
        let extraRoadAddr = '';

        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
        }
        if (extraRoadAddr !== '') {
          fullRoadAddr += ' (' + extraRoadAddr + ')';
        }

        setRestaurant(prevState => ({
          ...prevState,
          roadAddress: fullRoadAddr,
          numberAddress: data.jibunAddress
        }));

        fetchGeocode(fullRoadAddr);
      }
    }).open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('restaurant', new Blob([JSON.stringify(restaurant)], { type: 'application/json' }));

    if (restaurant.mainPhotoFile) formData.append('photos', restaurant.mainPhotoFile);
    if (restaurant.photo1File) formData.append('photos', restaurant.photo1File);
    if (restaurant.photo2File) formData.append('photos', restaurant.photo2File);
    if (restaurant.photo3File) formData.append('photos', restaurant.photo3File);
    if (restaurant.photo4File) formData.append('photos', restaurant.photo4File);
    if (restaurant.photo5File) formData.append('photos', restaurant.photo5File);

    try {
        const response = await axios.post('/api/restaurant/create-with-photos', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        alert('Restaurant and photos created successfully');
    } catch (error) {
        console.error('There was an error creating the restaurant and uploading photos!', error);
    }
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
        <label>메인 사진 업로드</label>
        <input type="file" name="mainPhotoFile" onChange={handleFileChange} />
      </div>

      {[1, 2, 3, 4, 5].map((num) => (
        <div className="form-group" key={num}>
          <label>사진{num} 업로드</label>
          <input
            type="file"
            name={`photo${num}File`}
            onChange={handleFileChange}
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

export default RestaurantCreateForm ;
