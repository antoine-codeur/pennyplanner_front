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
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [editedTransaction, setEditedTransaction] = useState({});
  const [categories, setCategories] = useState([]);

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
        if (data && data.data) {
          setTransactions(data.data);
          setFilteredTransactions(data.data);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/categories', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        if (data && data.data) {
          setCategories(data.data);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTransactions();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [filterType, selectedMonth, selectedYear, transactions]);

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (filterType === 'monthly') {
      const monthIndex = MONTHS.indexOf(selectedMonth);
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === monthIndex &&
               transactionDate.getFullYear() === selectedYear;
      });
    } else if (filterType === 'yearly') {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getFullYear() === selectedYear;
      });
    }

    setFilteredTransactions(filtered);
  };

  const handleSaveBeforeEdit = async () => {
    if (editingTransactionId) {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/transactions/${editedTransaction.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...editedTransaction,
            category_id: editedTransaction.category?.id || null
          })
        });
        if (!response.ok) {
          throw new Error('Failed to update transaction');
        }
        const updatedData = await response.json();
        setTransactions(transactions.map(t => t.id === editedTransaction.id ? updatedData.data : t));
        setFilteredTransactions(filteredTransactions.map(t => t.id === editedTransaction.id ? updatedData.data : t));
        setEditingTransactionId(null);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleEdit = async (transaction) => {
    if (editingTransactionId) {
      await handleSaveBeforeEdit();
    }
    setEditingTransactionId(transaction.id);
    setEditedTransaction({ ...transaction });
  };

  const handleDelete = async (transactionId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/transactions/${transactionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      setFilteredTransactions(prev => prev.filter(t => t.id !== transactionId));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRetrieve = async (transaction) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/transactions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...transaction,
          category_id: transaction.category?.id || null
        })
      });
      if (!response.ok) {
        throw new Error('Failed to retrieve transaction');
      }
      const restoredTransaction = await response.json();

      if (restoredTransaction && restoredTransaction.data) {
        const restoredData = restoredTransaction.data;

        // Ajouter la transaction récupérée à la liste des transactions
        setTransactions(prev => [...prev, restoredData]);
        setFilteredTransactions(prev => [...prev, restoredData]);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = Number(e.target.value);
    setEditedTransaction(prev => ({
      ...prev,
      category: categories.find(cat => cat.id === categoryId)
    }));
  };

  return (
    <div>
      <h2>Transaction List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div className="filter-controls">
        {/* Vos contrôles de filtre */}
      </div>
      
      <table className="transaction-table">
        <thead>
          <tr>
            <th className="type-column">Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th className="date-column">Date</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map(transaction => (
            <tr key={transaction.id}>
              <td className="type-column">
                {editingTransactionId === transaction.id ? (
                  <select
                    name="type"
                    value={editedTransaction.type}
                    onChange={handleChange}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                ) : (
                  transaction.type
                )}
              </td>
              <td>
                {editingTransactionId === transaction.id ? (
                  <input
                    type="number"
                    name="amount"
                    value={editedTransaction.amount || ''} 
                    onChange={handleChange}
                    step="0.01"
                  />
                ) : (
                  <span className={transaction.type === 'income' ? 'income-amount' : 'expense-amount'}>
                    {transaction.amount}
                  </span>
                )}
              </td>
              <td>
                {editingTransactionId === transaction.id ? (
                  <input
                    type="text"
                    name="description"
                    value={editedTransaction.description || ''}
                    onChange={handleChange}
                  />
                ) : (
                  transaction.description
                )}
              </td>
              <td className="date-column">
                {editingTransactionId === transaction.id ? (
                  <input
                    type="date"
                    name="date"
                    value={editedTransaction.date || ''}
                    onChange={handleChange}
                  />
                ) : (
                  transaction.date
                )}
              </td>
              <td>
                {editingTransactionId === transaction.id ? (
                  <select
                    name="category"
                    value={editedTransaction.category?.id || ''}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                ) : (
                  <div>
                    <i className={`fa ${transaction.category?.icon || 'fa-tag'} category-icon`}></i>
                    <span className="category-title">{transaction.category?.name || 'N/A'}</span>
                  </div>
                )}
              </td>
              <td>
                {editingTransactionId === transaction.id ? (
                  <div>
                    <button onClick={handleSaveBeforeEdit}>Save</button>
                    <button onClick={() => setEditingTransactionId(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => handleEdit(transaction)}>Edit</button>
                    <button onClick={() => handleDelete(transaction.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
