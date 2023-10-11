import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  position: relative;
  display: flex;
  top: 0;
  left: 0;
  padding: 8px;
  background-color: #fff;
  
  z-index: 1000;
`;
// box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
const InputStyled = styled.input`
  height: 32px;
  width: 160px;
  border-radius: 3px;
  border: 1px solid #e5e5e5;
  padding: 0 16px;
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <FilterContainer>
    <InputStyled
      id="search"
      type="text"
      placeholder="Search"
      value={filterText}
      onChange={onFilter}
    />
  </FilterContainer>
);

export default FilterComponent;
