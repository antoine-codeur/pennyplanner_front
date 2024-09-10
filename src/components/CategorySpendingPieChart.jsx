import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategorySpendingPieChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  // Fonction pour obtenir le token
  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      try {
        const response = await axios.get('http://localhost:8000/api/v1/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-CSRF-TOKEN': '', // Ajoutez le token CSRF si nécessaire
            accept: 'application/json',
          },
        });
        processData(response.data.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const processData = (transactions) => {
    const categoryData = transactions.reduce((acc, transaction) => {
      const { amount, category } = transaction;
      if (category && category.name) { // Vérifie que category et category.name existent
        if (!acc[category.name]) {
          acc[category.name] = 0;
        }
        acc[category.name] += parseFloat(amount);
      }
      return acc;
    }, {});

    setChartData({
      labels: Object.keys(categoryData),
      datasets: [{
        label: 'Dépenses par Catégorie',
        data: Object.values(categoryData),
        backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0'],
        hoverBackgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0']
      }]
    });
  };

  const options = {
    plugins: {
      legend: {
        position: 'top', // Vous pouvez changer la position à 'left', 'right', 'bottom'
        labels: {
          color: 'black', // Spécifie la couleur du texte de la légende
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <h3>Dépenses par Catégorie</h3>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default CategorySpendingPieChart;
