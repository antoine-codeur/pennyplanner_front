import React, { useEffect, useState } from 'react';
import { getToken } from '../auth';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

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
        setError(error.message);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Transaction List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            <p>Type: {transaction.type}</p>
            <p>Amount: {transaction.amount}</p>
            <p>Description: {transaction.description}</p>
            <p>Date: {transaction.date}</p>
            <p>Category: {transaction.category.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;