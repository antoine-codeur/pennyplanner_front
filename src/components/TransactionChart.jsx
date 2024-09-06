import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getToken } from '../auth';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TransactionChart = () => {
  const [chartData, setChartData] = useState({
    labels: ['Income', 'Expense'],
    datasets: [{
      label: 'Transactions',
      data: [0, 0], // Default data
      backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
      borderWidth: 1
    }]
  });

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
        processTransactions(data.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTransactions();
  }, []);

  const processTransactions = (transactions) => {
    const sums = { income: 0, expense: 0 };
    transactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        sums.income += parseFloat(transaction.amount);
      } else {
        sums.expense += parseFloat(transaction.amount);
      }
    });
    setChartData({
      labels: ['Income', 'Expense'],
      datasets: [{
        label: 'Transactions',
        data: [sums.income, sums.expense],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1
      }]
    });
  };

  return (
    <div style={{ width: '600px', height: '400px' }}>
      <Bar data={chartData} />
    </div>
  );
};

export default TransactionChart;
