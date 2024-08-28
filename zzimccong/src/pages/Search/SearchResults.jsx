import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import fiter from '../../assets/icons/fiter.png';
import grade from '../../assets/icons/grade.png';
import './SearchResults.css';
import Modal from 'react-modal';
import SearchFilter from './SearchFilter';
import SearchDefault from './SearchDefault';

const SearchResults = ({searchWord, results, loading, error, searchPerformed}) => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState(results);
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {  
    setFilteredResults(results);  
  }, [results]);

  const navigateToStoreDetails = (storeId) => {
    navigate(`/restaurant/${storeId}`);  
  };

  //주소 파싱                                      
  const getShortAddress = (address) => {
    const parts = address.split(' ');  
    return parts.slice(0, 2).join(' ');  
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleApplyFilters = async (filters) => {
    setSelectedFilters(filters); 
    closeModal(); 
    console.log('Selected Filters:', filters);

    const filtersWithSearchWord = {
      ...filters,
      searchWord: searchWord, 
    };

    try {
      const response = await axios.post(`api/search/filter`, filtersWithSearchWord, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setFilteredResults(response.data);
    } catch (err) {
      console.error('검색 결과를 가져오는 중 오류 발생:', err);
    } 

  };

  const isAnyFilterSelected = () => {
    return Object.keys(selectedFilters).some((key) => selectedFilters[key].length > 0);
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p className="SearchResults-error-message">{error}</p>;
  }

  if (!searchWord) {
    return <SearchDefault />;
  }

  if (searchPerformed && results.length === 0) {
    return <SearchDefault />;
  }
 
  return (
    <div>
      {results.length > 0 && (
        <img
          src={fiter} className={`SearchResults-fiter ${isAnyFilterSelected() ? 'active-filter' : ''}`}  alt="Filter"
          onClick={openModal}
        />
      )}
      { filteredResults.map((store) => (
        <div key={store.id} className="SearchResults-store-item" onClick={() => navigateToStoreDetails(store.id)}>
        <div className="SearchResults-store-item-content">
          <img src={store.photo1Url} alt={`${store.name} 사진`} />
          <div className="SearchResults-store-details">
            <h3>{store.name}</h3>
            <p>{store.category} / {getShortAddress(store.roadAddress)}</p>
            <p className="SearchResults-store-grade">
              <img src={grade} alt="Grade" /> {store.grade} / 5.0
            </p>
          </div>
        </div>
        <hr className="SearchResults-store-divider" />
      </div>
      ))}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Filter Modal"
        className="SearchResults-Modal"
        overlayClassName="SearchResults-Overlay"
      >
        <SearchFilter onClose={closeModal} onApplyFilters={handleApplyFilters}
                      selectedFilters={selectedFilters} />
      </Modal>
    </div>
  );
};

export default SearchResults;
