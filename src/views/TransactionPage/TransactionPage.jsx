import React from 'react';
import TransactionList from '../../components/TransactionList';
import TransactionChart from '../../components/TransactionChart';

const TransactionPage = () => {
  return (
    <div>
      <h1>Welcome to the Transaction Page!</h1>
      <TransactionList />
      <TransactionChart />
    </div>
  );
};

export default TransactionPage;