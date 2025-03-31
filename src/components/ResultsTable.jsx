import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { FixedSizeList as List } from 'react-window';
import { FaSort, FaSortUp, FaSortDown, FaFilter, FaDownload } from 'react-icons/fa';

const TableContainer = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 20px;
  background: white;
`;

const TableControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
`;

const TableHeader = styled.div`
  display: flex;
  background: #f5f5f5;
  border-bottom: 2px solid #ddd;
  font-weight: bold;
  position: sticky;
  top: 0;
`;

const HeaderCell = styled.div`
  flex: 1;
  padding: 12px;
  border-right: 1px solid #ddd;
  min-width: 150px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  position: relative;

  &:hover {
    background: #e9e9e9;
  }

  &:last-child {
    border-right: none;
  }
`;

const TableCell = styled.div`
  flex: 1;
  padding: 12px;
  border-right: 1px solid #ddd;
  min-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:last-child {
    border-right: none;
  }
`;

const FilterPopup = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 12px;
  z-index: 1000;
  min-width: 200px;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const Button = styled.button`
  background: ${props => props.$primary ? '#4CAF50' : '#fff'};
  color: ${props => props.$primary ? '#fff' : '#333'};
  border: 1px solid ${props => props.$primary ? '#4CAF50' : '#ddd'};
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;

  &:hover {
    background: ${props => props.$primary ? '#45a049' : '#f5f5f5'};
  }
`;

const SearchInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
  margin-right: 8px;
`;

const ResultsInfo = styled.div`
  color: #666;
  font-size: 14px;
`;

const NoResults = styled.div`
  padding: 40px;
  text-align: center;
  color: #666;
  font-size: 16px;
`;

const ResultsTable = ({ data, isLoading }) => {
  const [columns, setColumns] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filters, setFilters] = useState({});
  const [activeFilter, setActiveFilter] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const ROW_HEIGHT = 40;

  useEffect(() => {
    if (data && data.length > 0) {
      setColumns(Object.keys(data[0]));
    }
  }, [data]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilter = (column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const toggleFilter = (column) => {
    setActiveFilter(activeFilter === column ? null : column);
  };

  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];
    
    let processedData = [...data];

    if (globalSearch) {
      processedData = processedData.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(globalSearch.toLowerCase())
        )
      );
    }

    Object.entries(filters).forEach(([column, filterValue]) => {
      if (filterValue) {
        processedData = processedData.filter(item =>
          String(item[column]).toLowerCase().includes(filterValue.toLowerCase())
        );
      }
    });

    if (sortConfig.key) {
      processedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return processedData;
  }, [data, sortConfig, filters, globalSearch]);

  const handleExport = () => {
    const csv = [
      columns.join(','),
      ...filteredAndSortedData.map(row =>
        columns.map(column => JSON.stringify(row[column])).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query_results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <TableContainer>
        <NoResults>Loading results...</NoResults>
      </TableContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <TableContainer>
        <NoResults>No results to display</NoResults>
      </TableContainer>
    );
  }

  const Row = ({ index, style }) => (
    <div style={style}>
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #ddd',
          background: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
        }}
      >
        {columns.map(column => (
          <TableCell key={column}>
            {filteredAndSortedData[index][column]}
          </TableCell>
        ))}
      </div>
    </div>
  );

  return (
    <TableContainer>
      <TableControls>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <SearchInput
            type="text"
            placeholder="Search all columns..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
          <Button onClick={handleExport}>
            <FaDownload /> Export CSV
          </Button>
        </div>
        <ResultsInfo>{filteredAndSortedData.length} rows</ResultsInfo>
      </TableControls>

      <TableHeader>
        {columns.map(column => (
          <HeaderCell key={column} onClick={() => handleSort(column)}>
            {column}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
              {sortConfig.key === column && (
                sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
              )}
              <FaFilter
                style={{ opacity: filters[column] ? 1 : 0.5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFilter(column);
                }}
              />
            </div>
            {activeFilter === column && (
              <FilterPopup onClick={(e) => e.stopPropagation()}>
                <FilterInput
                  type="text"
                  placeholder={`Filter ${column}...`}
                  value={filters[column] || ''}
                  onChange={(e) => handleFilter(column, e.target.value)}
                />
              </FilterPopup>
            )}
          </HeaderCell>
        ))}
      </TableHeader>

      <List
        height={400}
        itemCount={filteredAndSortedData.length}
        itemSize={ROW_HEIGHT}
        width="100%"
      >
        {Row}
      </List>
    </TableContainer>
  );
};

export default ResultsTable;
