import React, { useState } from 'react';
import styled from 'styled-components';
import CodeMirror from '@uiw/react-codemirror';
import { FaPlay, FaStar, FaHistory, FaCode, FaDownload } from 'react-icons/fa';
import { queryTemplates, mockQueryHistory } from '../utils/mockDataGenerator';

const EditorWrapper = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  background: #1e1e1e;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #2d2d2d;
  border-bottom: 1px solid #404040;
`;

const EditorControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Button = styled.button`
  background: ${props => props.$primary ? '#4CAF50' : '#2d2d2d'};
  color: ${props => props.$primary ? 'white' : '#ccc'};
  border: ${props => props.$primary ? 'none' : '1px solid #404040'};
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$primary ? '#45a049' : '#383838'};
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #404040;
  background: #2d2d2d;
  color: white;
  cursor: pointer;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const SidePanel = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.$isOpen ? '0' : '-320px'};
  width: 320px;
  height: 100vh;
  background: #1e1e1e;
  border-left: 1px solid #404040;
  transition: right 0.3s ease;
  z-index: 1000;
  padding: 20px;
  color: #fff;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
`;

const PanelTitle = styled.h3`
  margin-bottom: 16px;
  color: #fff;
`;

const ListItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid #404040;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2d2d2d;
  }
`;

const ItemTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const ItemMeta = styled.div`
  font-size: 12px;
  color: #888;
`;

const MetricsBar = styled.div`
  display: flex;
  gap: 16px;
  padding: 8px 16px;
  background: #2d2d2d;
  border-top: 1px solid #404040;
  color: #ccc;
  font-size: 12px;
`;

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const QueryEditor = ({
  query,
  onQueryChange,
  onRunQuery,
  predefinedQueries,
  onSelectPredefinedQuery,
  selectedQueryId,
  isRunning,
  executionMetrics
}) => {
  const [sidePanelContent, setSidePanelContent] = useState(null);

  const togglePanel = (content) => {
    setSidePanelContent(sidePanelContent === content ? null : content);
  };

  const renderPanelContent = () => {
    switch (sidePanelContent) {
      case 'templates':
        return (
          <>
            <PanelTitle>Query Templates</PanelTitle>
            {queryTemplates.map((template, index) => (
              <ListItem key={index} onClick={() => onQueryChange(template.template)}>
                <ItemTitle>{template.name}</ItemTitle>
                <ItemMeta>{template.description}</ItemMeta>
              </ListItem>
            ))}
          </>
        );
      case 'history':
        return (
          <>
            <PanelTitle>Query History</PanelTitle>
            {mockQueryHistory.map((item) => (
              <ListItem key={item.id} onClick={() => onQueryChange(item.query)}>
                <ItemTitle>{item.query.slice(0, 50)}...</ItemTitle>
                <ItemMeta>
                  {new Date(item.timestamp).toLocaleString()} • {item.execution_time} • {item.rows_returned} rows
                </ItemMeta>
              </ListItem>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <EditorWrapper>
      <EditorHeader>
        <EditorControls>
          <Select
            value={selectedQueryId}
            onChange={(e) => onSelectPredefinedQuery(Number(e.target.value))}
          >
            {predefinedQueries.map(q => (
              <option key={q.id} value={q.id}>{q.name}</option>
            ))}
          </Select>
          <Button onClick={() => togglePanel('templates')}>
            <FaCode /> Templates
          </Button>
          <Button onClick={() => togglePanel('history')}>
            <FaHistory /> History
          </Button>
        </EditorControls>
        <EditorControls>
          <Button>
            <FaStar /> Save
          </Button>
          <Button $primary onClick={onRunQuery} disabled={isRunning}>
            <FaPlay /> {isRunning ? 'Running...' : 'Run Query'}
          </Button>
        </EditorControls>
      </EditorHeader>

      <CodeMirror
        value={query}
        height="200px"
        theme="dark"
        onChange={onQueryChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          syntax: 'sql'
        }}
      />

      {executionMetrics && (
        <MetricsBar>
          <MetricItem>Execution Time: {executionMetrics.execution_time}</MetricItem>
          <MetricItem>Rows Scanned: {executionMetrics.rows_scanned}</MetricItem>
          <MetricItem>Rows Returned: {executionMetrics.rows_returned}</MetricItem>
          <MetricItem>Cache Hit Ratio: {executionMetrics.cache_hit_ratio}</MetricItem>
        </MetricsBar>
      )}

      <SidePanel $isOpen={!!sidePanelContent}>
        <CloseButton onClick={() => setSidePanelContent(null)}>×</CloseButton>
        {renderPanelContent()}
      </SidePanel>
    </EditorWrapper>
  );
};

export default QueryEditor;
