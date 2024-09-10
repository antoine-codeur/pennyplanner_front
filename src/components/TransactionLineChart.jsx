import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getToken } from '../auth';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TransactionLineChart = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
  const [chartData, setChartData] = useState(null); // Initialize as null

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = getToken();
      try {
        const response = await fetch('http://localhost:8000/api/v1/transactions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        setTransactions(data.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    if (!transactions.length) return; // Prevents processing if no transactions

    const filterTransactionsByMonth = transactions.filter(transaction =>
      transaction.date.startsWith(selectedMonth)
    );

    const groupedData = filterTransactionsByMonth.reduce((acc, transaction) => {
      const date = transaction.date;
      if (!acc[date]) {
        acc[date] = { income: 0, expense: 0, total: 0 };
      }
      const amount = parseFloat(transaction.amount);
      if (transaction.type === 'income') {
        acc[date].income += amount;
        acc[date].total += amount;
      } else {
        acc[date].expense += amount;
        acc[date].total -= amount;
      }
      return acc;
    }, {});

    const labels = Object.keys(groupedData).sort();
    const incomes = labels.map(label => groupedData[label].income);
    const expenses = labels.map(label => groupedData[label].expense);
    const totals = labels.map(label => groupedData[label].total);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Total',
          data: totals,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
        },
        {
          label: 'Income',
          data: incomes,
          borderColor: 'green',
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
        },
        {
          label: 'Expense',
          data: expenses,
          borderColor: 'red',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
        }
      ]
    });
  }, [transactions, selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div>
      <select value={selectedMonth} onChange={handleMonthChange}>
        {Array.from(new Set(transactions.map(t => t.date.substring(0, 7)))).map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
      <div style={{ width: '100%', height: '400px' }}>
        {chartData ? <Line data={chartData} /> : <p>Loading chart...</p>}
      </div>
    </div>
  );
};

export default TransactionLineChart;
