import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import SearchResults from './SearchResults';
import back from '../../assets/icons/back.png';
import logo from '../../assets/icons/logo.png';
import './Searchcomponent.css';

const SearchComponent = () => {
  const navigate = useNavigate();
  const [searchWord, setSearchWord] = useState(localStorage.getItem('searchWord') || '');
  const [results, setResults] = useState(JSON.parse(localStorage.getItem('results')) || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (searchPerformed) {
        setLoading(true);
        setError(null);

        try {
          const response = await axios.get(`api/search/${searchWord}`);
          setResults(response.data);
          localStorage.setItem('results', JSON.stringify(response.data)); 
        } catch (err) {
          console.error('검색 결과를 가져오는 중 오류 발생:', err);
          setError('검색 결과를 가져오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
          setSearchPerformed(false);
        }
      }
    };

    fetchData();
  }, [searchPerformed, searchWord]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchWord(value);
    localStorage.setItem('searchWord', value); 
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchPerformed(true);
  };

  const handleBackClick = () => {
    setSearchWord(''); 
    setResults([]); 
    localStorage.removeItem('searchWord'); 
    localStorage.removeItem('results'); 
    localStorage.removeItem('selectedFilters'); // 모달창 필터 설정 초기화
    navigate('/'); 
  };

  return (
    <div>
      <div className="header">
        <img src={logo} className="logo" />
        <div className="searchcomponent_title">검색하기</div>
      </div>
      <div className="searchcomponent_search-component">
        <form className="keyword-search" onSubmit={handleSubmit}>
          <img src={back} className="searchcomponent_back" alt="back button" 
            onClick={handleBackClick} />
          <input
            className="searchcomponent_search-input"
            type="text"
            placeholder="지역, 음식, 매장명 검색"
            value={searchWord}
            onChange={handleChange}
            aria-label="검색어 입력"
          />
          <button
            type="submit"
            className="searchcomponent_search-button"
            aria-label="검색 버튼"
          >
            Search
          </button>
        </form>

        <div style={{overflow: 'auto', height: '600px'}}>
          <SearchResults
              searchWord={searchWord}
              results={results}
              loading={loading}
              error={error}
              searchPerformed={searchPerformed}
              onBackClick={handleBackClick} // handleBackClick 전달
            />
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
