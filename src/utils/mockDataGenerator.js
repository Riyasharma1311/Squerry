export const generateMockResults = (queryType) => {
  switch (queryType) {
    case 'employees':
      return Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Employee ${i + 1}`,
        department: ['Engineering', 'Design', 'Product', 'Marketing'][Math.floor(Math.random() * 4)],
        salary: Math.floor(Math.random() * 100000) + 50000,
        hire_date: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
        performance_score: Math.floor(Math.random() * 5) + 1
      }));
    
    case 'sales':
      return Array.from({ length: 500 }, (_, i) => ({
        product_name: `Product ${i + 1}`,
        total_revenue: Math.floor(Math.random() * 1000000),
        units_sold: Math.floor(Math.random() * 1000),
        quarter: `Q${Math.floor(Math.random() * 4) + 1}`,
        growth_rate: (Math.random() * 0.4 - 0.1).toFixed(2),
        market_segment: ['Enterprise', 'SMB', 'Consumer'][Math.floor(Math.random() * 3)]
      }));
    
    case 'customers':
      return Array.from({ length: 750 }, (_, i) => ({
        customer_id: `CUST${String(i + 1).padStart(4, '0')}`,
        total_orders: Math.floor(Math.random() * 50) + 1,
        total_spent: Math.floor(Math.random() * 10000),
        last_order_date: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
        customer_segment: ['Premium', 'Standard', 'Basic'][Math.floor(Math.random() * 3)],
        churn_risk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
      }));
    
    default:
      return [];
  }
};

export const queryTemplates = [
  {
    name: "Basic Select",
    template: "SELECT * FROM table_name WHERE condition;",
    description: "Simple select query with a where clause"
  },
  {
    name: "Aggregation",
    template: "SELECT column, COUNT(*) as count FROM table_name GROUP BY column;",
    description: "Group by query with count aggregation"
  },
  {
    name: "Join Operation",
    template: "SELECT t1.*, t2.* FROM table1 t1 JOIN table2 t2 ON t1.id = t2.id;",
    description: "Basic join between two tables"
  },
  {
    name: "Complex Analysis",
    template: "WITH ranked AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY group_col ORDER BY value_col) as rank FROM table_name) SELECT * FROM ranked WHERE rank <= 5;",
    description: "Window function with CTE for complex analysis"
  }
];

export const mockQueryHistory = [
  {
    id: 1,
    timestamp: "2024-03-30T10:00:00",
    query: "SELECT * FROM employees WHERE department = 'Engineering' ORDER BY salary DESC;",
    execution_time: "1.2s",
    rows_returned: 1000
  },
  {
    id: 2,
    timestamp: "2024-03-30T09:45:00",
    query: "SELECT product_name, SUM(revenue) as total_revenue FROM sales GROUP BY product_name;",
    execution_time: "0.8s",
    rows_returned: 500
  }
];

export const generateExecutionMetrics = () => ({
  execution_time: (Math.random() * 2).toFixed(1) + 's',
  rows_scanned: Math.floor(Math.random() * 10000),
  rows_returned: Math.floor(Math.random() * 1000),
  cache_hit_ratio: (Math.random()).toFixed(2)
});
