import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import QueryEditor from './components/QueryEditor';
import ResultsTable from './components/ResultsTable';
import { predefinedQueries } from './mock/queries';
import { generateMockResults, generateExecutionMetrics } from './utils/mockDataGenerator';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: #fff;
`;

const AppHeader = styled.header`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0;
`;

const ErrorMessage = styled.div`
  padding: 12px;
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
  color: #c62828;
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

function App() {
  const [selectedQueryId, setSelectedQueryId] = useState(predefinedQueries[0].id);
  const [query, setQuery] = useState(predefinedQueries[0].query);
  const [results, setResults] = useState(predefinedQueries[0].data);
  const [isRunning, setIsRunning] = useState(false);
  const [executionMetrics, setExecutionMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);

  const handleQueryChange = useCallback((value) => {
    setQuery(value);
    setError(null);
  }, []);

  const handleQuerySelect = useCallback((queryId) => {
    const selectedQuery = predefinedQueries.find(q => q.id === queryId);
    if (selectedQuery) {
      setSelectedQueryId(queryId);
      setQuery(selectedQuery.query);
      setResults(selectedQuery.data);
      setError(null);
    }
  }, []);

  const handleRunQuery = useCallback(() => {
    setIsRunning(true);
    setError(null);

    setTimeout(() => {
      try {
        
        let queryType = 'employees';
        if (query.toLowerCase().includes('sales')) queryType = 'sales';
        if (query.toLowerCase().includes('customer')) queryType = 'customers';

        const mockResults = generateMockResults(queryType);
        setResults(mockResults);
        
        const metrics = generateExecutionMetrics();
        setExecutionMetrics(metrics);

        setQueryHistory(prev => [{
          id: Date.now(),
          timestamp: new Date().toISOString(),
          query,
          execution_time: metrics.execution_time,
          rows_returned: metrics.rows_returned
        }, ...prev]);

      } catch (err) {
        setError('Error executing query: ' + err.message);
        setResults([]);
      } finally {
        setIsRunning(false);
      }
    }, 500);
  }, [query]);

  return (
    <AppContainer>
      <AppHeader>
        <Title>Squerry : A SQL Query Runner</Title>
      </AppHeader>

      <QueryEditor
        query={query}
        onQueryChange={handleQueryChange}
        onRunQuery={handleRunQuery}
        predefinedQueries={predefinedQueries}
        onSelectPredefinedQuery={handleQuerySelect}
        selectedQueryId={selectedQueryId}
        isRunning={isRunning}
        executionMetrics={executionMetrics}
      />

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      <ResultsTable 
        data={results}
        isLoading={isRunning}
      />
    </AppContainer>
  );
}

export default App;
