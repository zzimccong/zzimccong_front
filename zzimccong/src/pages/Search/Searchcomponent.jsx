import React, { useState , useEffect} from 'react';
import axios from '../../utils/axiosConfig';
import SearchResults from './SearchResults';

const SearchComponent = () => {
  const [searchWord, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);



  useEffect(() => {
    if (searchPerformed && searchWord) {
      handleSubmit(); 
    }
  }, []);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      const response = await axios.get(`api/search/${searchWord}`);
      setResults(response.data);
    } catch (err) {
      console.error('검색 결과를 가져오는 중 오류 발생:', err);
      setError('검색 결과를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="search-component w-full">
      <form className="keyword-search keyword-search-main w-full mb-2" onSubmit={handleSubmit}>
        <input
          className="pl-10 pr-4 text-xs h-9 w-full"
          type="text"
          placeholder="지역, 음식, 매장명 검색"
          value={searchWord}
          onChange={handleChange}
          aria-label="검색어 입력"
        />
        <button
          type="submit"
          className="search-button absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded"
          aria-label="검색 버튼"
        >
          검색
        </button>
      </form>
      <div style={{ overflow: 'auto', height: '600px' }}>
        <div className="search-results h-96">
        <SearchResults
            results={results}
            loading={loading}
            error={error}
            searchPerformed={searchPerformed}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
