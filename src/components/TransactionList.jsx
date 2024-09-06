import React, { useEffect, useState } from 'react';
import './TransactionList.css';

// Liste des mois
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('monthly'); // 'monthly' or 'yearly'
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/transactions', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data.data);
        setFilteredTransactions(data.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [filterType, selectedMonth, selectedYear, transactions]);

  const filterTransactions = () => {
    let filtered = transactions;

    if (filterType === 'monthly') {
      const monthIndex = MONTHS.indexOf(selectedMonth);
      filtered = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === monthIndex &&
               transactionDate.getFullYear() === selectedYear;
      });
    } else if (filterType === 'yearly') {
      filtered = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getFullYear() === selectedYear;
      });
    }

    setFilteredTransactions(filtered);
  };

  return (
    <div>
      <h2>Transaction List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div className="filter-controls">
        <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        
        {filterType === 'monthly' && (
          <>
            <select onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth}>
              {MONTHS.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
            <select onChange={(e) => setSelectedYear(Number(e.target.value))} value={selectedYear}>
              {[...Array(10)].map((_, i) => (
                <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
              ))}
            </select>
          </>
        )}

        {filterType === 'yearly' && (
          <select onChange={(e) => setSelectedYear(Number(e.target.value))} value={selectedYear}>
            {[...Array(10)].map((_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
            ))}
          </select>
        )}
      </div>

      <table className="transaction-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Date</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.type}</td>
              <td className={`amount ${transaction.type === 'income' ? 'income-amount' : 'expense-amount'}`}>
                {transaction.amount}
              </td>
              <td>{transaction.description}</td>
              <td>{transaction.date}</td>
              <td>{transaction.category.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;