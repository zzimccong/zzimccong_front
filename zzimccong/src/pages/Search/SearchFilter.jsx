import React, {useState, useEffect} from "react";
import './SearchFilter.css';

const SearchFilter = ({ onClose, onApplyFilters, selectedFilters }) => {
    
  const [filters, setFilters] = useState(selectedFilters);

  useEffect(() => {
    setFilters(selectedFilters); // 모달이 열릴 때마다 부모에서 받은 필터 상태로 초기화
  }, [selectedFilters]);

    const toggleFilter = (filter) => {
      setFilters((prevFilters) =>
        prevFilters.includes(filter)
         ? prevFilters.filter((item) => item !== filter)
          : [...prevFilters, filter]
      );
    };

    const handleApply = () => {
       onApplyFilters(filters); // 선택된 필터를 부모 컴포넌트로 전달
      //  onClose();
    };

    const handleReset = () => {
      setFilters([]); // 모든 필터를 초기화
    };
    
    return (
          <div className="filter-modal-content">
            <div className="filter-scrollable-content">
              <button className="reset-button" onClick={handleReset}>초기화</button>
              <div className="filter-group">
                <h4>나라별</h4>
                {['한식', '일식', '중식', '양식', '아시아 음식', '아메리칸 음식'].map((filter) => (
                  <button
                    key={filter}
                    className={filters.includes(filter) ? 'active' : ''}
                    onClick={() => toggleFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
                <hr />
              </div>

              <div className="filter-group">
                <h4>테이블 타입</h4>
                {['룸', '단체석', '바테이블', '연인석', '1인석', '테라스', '루프탑'].map((filter) => (
                  <button
                    key={filter}
                    className={filters.includes(filter) ? 'active' : ''}
                    onClick={() => toggleFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
                <hr />
              </div>

              <div className="filter-group">
                <h4>편의시설</h4>
                {['주차 가능', '콜키지 가능', '그릴링 서비스', '반려동물 동반 가능', '장애인 편의시설'].map((filter) => (
                  <button
                    key={filter}
                    className={filters.includes(filter) ? 'active' : ''}
                    onClick={() => toggleFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
                <hr />
              </div>

              <div className="filter-group">
                <h4>분위기</h4>
                {['비즈니스 미팅', '데이트', '기념일', '가족 모임', '조용한', '전통적인'].map((filter) => (
                  <button
                    key={filter}
                    className={filters.includes(filter) ? 'active' : ''}
                    onClick={() => toggleFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
                <hr />
              </div>
            </div>

            <div className="modal-footer">
              <button className="apply-button" onClick={handleApply}>적용</button>
              <button className="close-button" onClick={onClose}>닫기</button>
            </div>
        </div>
      );
};

export default SearchFilter;