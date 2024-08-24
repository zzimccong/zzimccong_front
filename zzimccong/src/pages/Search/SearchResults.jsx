import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import fiter from '../../assets/icons/fiter.png';
import grade from '../../assets/icons/grade.png';
import './SearchResults.css';
import Modal from 'react-modal';
import SearchFilter from './SearchFilter';


const SearchResults = ({searchWord, results, loading, error, searchPerformed}) => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState(results);
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {  // results가 변경될 때마다 filteredResults를 초기화
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
    setSelectedFilters(filters); // 필터를 저장
    closeModal(); // 모달 닫기
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
      // setError('검색 결과를 가져오는 중 오류가 발생했습니다.');
    } 

  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (searchPerformed && results.length === 0) {
    return <p>검색 결과가 없습니다.</p>;
  }
 
  console.log(filteredResults); //이거 지울거
  return (
    <div>
      {results.length > 0 && (
        <img
          src={fiter} className="fiter" alt="Filter"
          onClick={openModal}
        />
      )}
      { filteredResults.map((store) => (
        <div key={store.id} className="store-item  p-4 mb-4 rounded-lg" style={{ maxWidth: '700px' }}
              onClick={() => navigateToStoreDetails(store.id)}>
            <div style={{ display: 'flex', alignItems: 'center'}}>  
              <img src={store.photo1Url} alt={`${store.name} 사진`} style={{ margin: '10px', width: '120px', height: '120px' }} />
              <div style={{ flexGrow: 1 }}>
                <h3 className="text-xl font-bold">{store.name}</h3>
                <p>{store.category} / {getShortAddress(store.roadAddress)}</p>
                <p style={{display: 'flex', alignItems: 'center' }}> 
                  <img src={grade} style={{ margin: '5px', width: '20px'}}/> {store.grade} / 5.0 
                </p>
              </div>
            </div>
          <hr style={{ width: '435px', margin: 'auto'}}/>
        </div>
      ))}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Filter Modal"
        // ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <SearchFilter onClose={closeModal} onApplyFilters={handleApplyFilters}
                      selectedFilters={selectedFilters} />
      </Modal>
    </div>
  );
};

export default SearchResults;
