import React from 'react';
import CategorySpendingPieChart from '../../components/CategorySpendingPieChart';
import TransactionLineChart from '../../components/TransactionLineChart';


const HomePage = () => {
    return (
        <div>
            <h1>HomePage</h1>
            <CategorySpendingPieChart />
            <TransactionLineChart />
        </div>
    );
};

export default HomePage;
