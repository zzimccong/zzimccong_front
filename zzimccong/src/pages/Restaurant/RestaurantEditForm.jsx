import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import './RestaurantForm.css'; // 추가된 CSS 파일을 import

function RestaurantEditForm() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({
    name: '',
    category: '',
    roadAddress: '',
    numberAddress: '',
    phoneNumber: '',
    detailInfo: '',
    businessHours: '',
    link: '',
    mainPhotoUrl: '',
    photo1Url: '',
    photo2Url: '',
    photo3Url: '',
    photo4Url: '',
    photo5Url: '',
    latitude: '',
    longitude: '',
    seats: '',
    facilities: '',
    parkingInfo: '',
  });

  useEffect(() => {
    axios.get(`api/restaurant/${id}`)
      .then(response => {
        setRestaurant(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the restaurant!', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurant({ ...restaurant, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`api/restaurantUpdate/${id}`, restaurant)
      .then(response => {
        alert('Restaurant updated successfully');
      })
      .catch(error => {
        console.error('There was an error updating the restaurant!', error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="restaurant-form">
      <h2>Edit Restaurant</h2>

      <div className="form-group">
        <label>Name:</label>
        <input type="text" name="name" value={restaurant.name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Category:</label>
        <input type="text" name="category" value={restaurant.category} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Road Address:</label>
        <input type="text" name="roadAddress" value={restaurant.roadAddress} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Number Address:</label>
        <input type="text" name="numberAddress" value={restaurant.numberAddress} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Phone Number:</label>
        <input type="text" name="phoneNumber" value={restaurant.phoneNumber} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Detail Info:</label>
        <textarea name="detailInfo" value={restaurant.detailInfo} onChange={handleChange}></textarea>
      </div>

      <div className="form-group">
        <label>Business Hours:</label>
        <input type="text" name="businessHours" value={restaurant.businessHours} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Link:</label>
        <input type="text" name="link" value={restaurant.link} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Facilities:</label>
        <input type="text" name="facilities" value={restaurant.facilities} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Parking Info:</label>
        <input type="text" name="parkingInfo" value={restaurant.parkingInfo} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Main Photo URL:</label>
        <input type="text" name="mainPhotoUrl" value={restaurant.mainPhotoUrl} onChange={handleChange} />
      </div>

      {[1, 2, 3, 4, 5].map((num) => (
        <div className="form-group" key={num}>
          <label>Photo {num} URL:</label>
          <input
            type="text"
            name={`photo${num}Url`}
            value={restaurant[`photo${num}Url`]}
            onChange={handleChange}
          />
        </div>
      ))}

      <div className="form-group">
        <label>Seats:</label>
        <input type="text" name="seats" value={restaurant.seats} onChange={handleChange} />
      </div>

      <button type="submit" className="submit-button">Update Restaurant</button>
    </form>
  );
}

export default RestaurantEditForm;
