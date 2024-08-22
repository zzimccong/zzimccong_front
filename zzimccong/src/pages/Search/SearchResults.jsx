import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fiter from '../../assets/icons/fiter.png';
import './SearchResults.css';
import Modal from 'react-modal';
import SearchFilter from './SearchFilter';

const SearchResults = ({results, loading, error, searchPerformed}) => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState(results);
  const [selectedFilters, setSelectedFilters] = useState([]);

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

  const handleApplyFilters = (filters) => {
    setSelectedFilters(filters); // 필터를 저장
    closeModal(); // 모달 닫기
    // 여기에서 필터를 적용하여 백엔드에서 데이터를 가져오는 로직을 추가할 수 있습니다.
    console.log('Selected Filters:', filters);
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
 
  console.log(results); //이거 지울거
  return (
    <div>
      {results.length > 0 && (
        <img
          src={fiter} className="fiter" alt="Filter"
          onClick={openModal}
        />
      )}
      { results.map((store) => (
        <div key={store.id} className="store-item  p-4 mb-4 rounded-lg" style={{ maxWidth: '700px' }}
              onClick={() => navigateToStoreDetails(store.id)}>
            <div style={{ display: 'flex', alignItems: 'center'}}>  
              <img src={store.photo1Url} alt={`${store.name} 사진`} style={{ margin: '10px', width: '120px', height: '120px' }} />
              <div style={{ flexGrow: 1 }}>
                <h3 className="text-xl font-bold">{store.name}</h3>
                <p>{store.category} / {getShortAddress(store.roadAddress)}</p>
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
        <SearchFilter onClose={closeModal} onApplyFilters={handleApplyFilters} />
      </Modal>
    </div>
  );
};

export default SearchResults;
