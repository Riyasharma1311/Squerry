export const predefinedQueries = [
  {
    id: 1,
    name: "Employee Details",
    query: "SELECT * FROM employees WHERE department = 'Engineering' ORDER BY salary DESC;",
    data: Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `Employee ${i + 1}`,
      department: ['Engineering', 'Design', 'Product', 'Marketing'][Math.floor(Math.random() * 4)],
      salary: Math.floor(Math.random() * 100000) + 50000,
      hire_date: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0]
    }))
  },
  {
    id: 2,
    name: "Sales Analytics",
    query: "SELECT product_name, SUM(revenue) as total_revenue FROM sales GROUP BY product_name ORDER BY total_revenue DESC;",
    data: Array.from({ length: 500 }, (_, i) => ({
      product_name: `Product ${i + 1}`,
      total_revenue: Math.floor(Math.random() * 1000000),
      units_sold: Math.floor(Math.random() * 1000),
      quarter: `Q${Math.floor(Math.random() * 4) + 1}`
    }))
  },
  {
    id: 3,
    name: "Customer Orders",
    query: "SELECT customer_id, COUNT(order_id) as total_orders, SUM(amount) as total_spent FROM orders GROUP BY customer_id;",
    data: Array.from({ length: 750 }, (_, i) => ({
      customer_id: `CUST${String(i + 1).padStart(4, '0')}`,
      total_orders: Math.floor(Math.random() * 50) + 1,
      total_spent: Math.floor(Math.random() * 10000),
      last_order_date: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28)).toISOString().split('T')[0]
    }))
  }
];
