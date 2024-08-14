import React, { useEffect } from 'react';
import axios from './../../utils/axiosConfig';

const Map = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=7kindl5h09`;
        script.async = true;
        script.onload = () => {
            if (window.naver && window.naver.maps) {
                initMap();
            } else {
                console.error("Naver Maps API failed to load.");
            }
        };
        document.head.appendChild(script);

        const initMap = () => {
            const map = new window.naver.maps.Map('map', {
                center: new window.naver.maps.LatLng(35.1795543, 129.0756416),
                zoom: 12
            });

            axios.get('/api/restaurants')
                .then(response => {
                    const data = response.data;
                    data.forEach(restaurant => {
                        const position = new window.naver.maps.LatLng(restaurant.latitude, restaurant.longitude);
                        const marker = new window.naver.maps.Marker({
                            position: position,
                            map: map,
                            title: restaurant.name
                        });

                        const infoWindow = new window.naver.maps.InfoWindow({
                            content: `
                                <h3>${restaurant.name}</h3>
                                <p>Category: ${restaurant.category}</p>
                                <p>Phone: ${restaurant.phoneNumber}</p>
                                <p>Address: ${restaurant.roadAddress}</p>
                            `
                        });

                        window.naver.maps.Event.addListener(marker, 'click', function() {
                            infoWindow.open(map, marker);
                        });
                    });
                })
                .catch(error => {
                    console.error('Error fetching restaurant data:', error);
                });
        };

    }, []);

    return (
        <div>
            <h1>Restaurant Map</h1>
            <div id="map" style={{ height: '600px', width: '100%' }}></div>
        </div>
    );
};

export default Map;
