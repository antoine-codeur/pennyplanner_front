import React, { useEffect, useState } from 'react';
import { getToken } from '../../auth';
import '@fortawesome/fontawesome-free/css/all.min.css';
import CategorySpendingPieChart from '../../components/CategorySpendingPieChart';
import CategoryList from '../../components/CategoryList';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const token = getToken();

      try {
        const response = await fetch('http://localhost:8000/api/v1/categories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Categories</h2>
      <CategorySpendingPieChart />
      <CategoryList />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            <i className={`fa ${category.icon}`}></i>
            <p>{category.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;