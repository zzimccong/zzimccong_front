import './SearchDefault.css';
import { useNavigate } from 'react-router-dom';
import search1 from "../../assets/icons/search1.png";
import search2 from "../../assets/icons/search2.png";
import search3 from "../../assets/icons/search3.png";
import searchkeyword1 from "../../assets/icons/searchkeyword1.png";
import searchkeyword2 from "../../assets/icons/searchkeyword2.png";
import searchkeyword3 from "../../assets/icons/searchkeyword3.png";
import searchBanner from "../../assets/icons/searchBanner.png";

const SearchDefault = () => {
  
  const navigator = useNavigate();
  const navigate = useNavigate();

  const navigateToStoreDetails = (storeId) => {
    navigate(`/restaurant/${storeId}`);
  };

  return (
    <div className="search-default">
      <div className="restaurant-categories">
        <h4></h4>
        <div className="category-cards">
          <div className="card">
            <img src={search1} alt="Restaurant 1" onClick={()=>navigator(`/event-list`)}/>
          </div>
          <div className="card">
            <img src={search3} alt="Restaurant 2" onClick={() => navigateToStoreDetails(18)}/>
          </div>
          <div className="card">
            <img src={search2} alt="Restaurant 3" onClick={() => navigateToStoreDetails(63)}/>
          </div>
        </div>
      </div>
      <hr/>
      <div className="restaurant-keywords">
      <h4 style={{display: 'flex'}}>여기는 어떠세요? <p style={{ fontSize: '12px', marginLeft: '5px', marginTop: '5px'}}>광고</p></h4>
        <div className="keyword-cards">
          <div className="keyword-card">
            <img src={searchkeyword1} alt="Keyword 1" onClick={() => navigateToStoreDetails(9)}/> 
          </div>
          <div className="keyword-card">
            <img src={searchkeyword2} alt="Keyword 2" onClick={() => navigateToStoreDetails(79)}/>
          </div>
          <div className="keyword-card">
            <img src={searchkeyword3} alt="Keyword 3" onClick={() => navigateToStoreDetails(14)}/>
          </div>
        </div>
      </div>
      <hr/>
      <img src={searchBanner} className="searchBanner" alt="searchBanner" />
      <hr/>
      <div className="recent-restaurants">
        <h3>추천 검색어</h3>
        <div className="restaurant-tags">
          <button>센텀시티</button>
          <button>두바이 초콜릿</button>
          <button>태국 음식</button>
          <button>한우 갈비</button>
          <button>용산동</button>
          <button>해운대구</button>
        </div>
      </div>


  </div>
  );
};

export default SearchDefault;