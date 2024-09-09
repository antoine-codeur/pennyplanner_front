import React, { useEffect, useState } from 'react';
// import './CategoryList.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newCategoryName,
          icon: newCategoryIcon
        })
      });
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      const data = await response.json();
      if (data && data.data) {
        setCategories(prev => [...prev, data.data]);
        setNewCategoryName('');
        setNewCategoryIcon('');
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Category List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="category-form">
        <h3>Create New Category</h3>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Icon Class (e.g., fa-baseball)"
          value={newCategoryIcon}
          onChange={(e) => setNewCategoryIcon(e.target.value)}
        />
        <button onClick={handleCreateCategory}>Add Category</button>
      </div>

      <table className="category-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Icon</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td><i className={`fa ${category.icon || 'fa-tag'}`}></i></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
