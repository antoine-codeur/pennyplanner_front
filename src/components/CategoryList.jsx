import React, { useEffect, useState } from 'react';
// import './CategoryList.css';

const ICONS = [
  { name: 'Briefcase', class: 'fa-briefcase' },
  { name: 'Credit Card', class: 'fa-credit-card' },
  { name: 'Money Bill', class: 'fa-money-bill' },
  { name: 'Gift', class: 'fa-gift' },
  { name: 'Handshake', class: 'fa-handshake' },
  { name: 'Business Time', class: 'fa-business-time' },
  { name: 'Home', class: 'fa-home' },
  { name: 'Car', class: 'fa-car' },
  { name: 'Utensils', class: 'fa-utensils' },
  { name: 'Shopping Cart', class: 'fa-shopping-cart' },
  { name: 'Bath', class: 'fa-bath' },
  { name: 'Medkit', class: 'fa-medkit' },
  { name: 'TV', class: 'fa-tv' },
  { name: 'Plane', class: 'fa-plane' },
  { name: 'Train', class: 'fa-train' },
  { name: 'Book', class: 'fa-book' },
  { name: 'Futbol', class: 'fa-futbol' },
  { name: 'Tshirt', class: 'fa-tshirt' },
  { name: 'Hotel', class: 'fa-hotel' },
  { name: 'Balance Scale', class: 'fa-balance-scale' },
  { name: 'Wallet', class: 'fa-wallet' },
  { name: 'Broadcast Tower', class: 'fa-broadcast-tower' },
  { name: 'Calculator', class: 'fa-calculator' },
  { name: 'Gas Pump', class: 'fa-gas-pump' },
];

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState(ICONS[0].class); // Default to first icon
  const [editingCategory, setEditingCategory] = useState(null);
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
          setCategories(data.data.map(cat => ({
            ...cat,
            icon: cat.icon || ICONS[0].class // Provide a default icon if null
          })));
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
      if (data && data.data && data.data.id) {
        setCategories(prev => [...prev, {
          id: data.data.id,
          name: data.data.name || newCategoryName,
          icon: data.data.icon || newCategoryIcon
        }]);
        setNewCategoryName('');
        setNewCategoryIcon(ICONS[0].class); // Reset to default icon
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editingCategory.name,
          icon: editingCategory.icon
        })
      });
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      const data = await response.json();
      if (data && data.data && data.data.id) {
        setCategories(prev => prev.map(cat => cat.id === data.data.id ? {
          ...data.data,
          icon: data.data.icon || ICONS[0].class // Provide a default icon if null
        } : cat));
        setEditingCategory(null);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingCategory) {
      setEditingCategory(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div>
      <h2>Category List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table className="category-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Icon</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
              <td>
                {editingCategory && editingCategory.id === category.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editingCategory.name}
                    onChange={handleChange}
                  />
                ) : (
                  category.name
                )}
              </td>
              <td>
                {editingCategory && editingCategory.id === category.id ? (
                  <select
                    name="icon"
                    value={editingCategory.icon}
                    onChange={handleChange}
                  >
                    {ICONS.map(icon => (
                      <option key={icon.class} value={icon.class}>
                        {icon.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <i className={`fa ${category.icon || 'fa-tag'}`}></i>
                )}
              </td>
              <td>
                {editingCategory && editingCategory.id === category.id ? (
                  <div>
                    <button onClick={handleEditCategory}>Save</button>
                    <button onClick={() => setEditingCategory(null)}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <button onClick={() => setEditingCategory(category)}>Edit</button>
                    <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="category-form">
        <h3>Create New Category</h3>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <select
          value={newCategoryIcon}
          onChange={(e) => setNewCategoryIcon(e.target.value)}
        >
          {ICONS.map(icon => (
            <option key={icon.class} value={icon.class}>
              {icon.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreateCategory}>Add Category</button>
      </div>
    </div>
  );
};

export default CategoryList;
