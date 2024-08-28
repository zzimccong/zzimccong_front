import React, { useState, useEffect } from "react";
import './SearchFilter.css';

const SearchFilter = ({ onClose, onApplyFilters, selectedFilters }) => {
    
  const [filters, setFilters] = useState(selectedFilters);

  useEffect(() => {
    setFilters(selectedFilters);
  }, [selectedFilters]);

  const toggleFilter = (category, filter) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (!newFilters[category]) {
        newFilters[category] = [];
      }
      if (newFilters[category].includes(filter)) {
        newFilters[category] = newFilters[category].filter((item) => item !== filter);
      } else {
        newFilters[category].push(filter);
      }
      return newFilters;
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = {};
    setFilters(resetFilters);
    localStorage.removeItem('selectedFilters'); // 필터 초기화 시 localStorage에서 제거
    onApplyFilters(resetFilters); // 초기화된 필터로 검색 적용
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
              className={filters['나라별']?.includes(filter) ? 'active' : ''}
              onClick={() => toggleFilter('나라별', filter)}
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
              className={filters['테이블 타입']?.includes(filter) ? 'active' : ''}
              onClick={() => toggleFilter('테이블 타입', filter)}
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
              className={filters['편의시설']?.includes(filter) ? 'active' : ''}
              onClick={() => toggleFilter('편의시설', filter)}
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
              className={filters['분위기']?.includes(filter) ? 'active' : ''}
              onClick={() => toggleFilter('분위기', filter)}
            >
              {filter}
            </button>
          ))}
          <hr />
        </div>
      </div>

      <div className="modal-footer">
        <button className="searchFilter-apply-button" onClick={handleApply}>적용</button>
        <button className="searchFilter-close-button" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default SearchFilter;
