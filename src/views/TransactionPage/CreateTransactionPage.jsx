import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../auth';

// Fonction utilitaire pour obtenir la date actuelle au format 'YYYY-MM-DD'
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Ajoute un zéro si le mois est inférieur à 10
  const day = String(today.getDate()).padStart(2, '0'); // Ajoute un zéro si le jour est inférieur à 10
  return `${year}-${month}-${day}`;
};

const CreateTransactionPage = () => {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getCurrentDate()); // Date par défaut
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories for the select dropdown
    const fetchCategories = async () => {
      const token = getToken();
      try {
        const response = await fetch('http://localhost:8000/api/v1/categories', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setCategories(data.data); // Assuming data.data contains the list of categories
      } catch (error) {
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    const newTransaction = {
      type,
      amount,
      description,
      date,
      category_id: categoryId,  // Adjust to match API
    };

    try {
      const response = await fetch('http://localhost:8000/api/v1/transactions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) {
        throw new Error('Failed to create transaction');
      }

      // Redirect to transactions page after successful creation
      navigate('/transactions');
    } catch (error) {
      setError('Failed to create transaction');
    }
  };

  return (
    <div>
      <h2>Create New Transaction</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Transaction</button>
      </form>
    </div>
  );
};

export default CreateTransactionPage;
