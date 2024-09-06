import React from 'react';
import TransactionList from '../../components/TransactionList';
import TransactionChart from '../../components/TransactionChart';
import TransactionLineChart from '../../components/TransactionLineChart';

const TransactionPage = () => {
  return (
    <div>
      <h1>Welcome to the Transaction Page!</h1>
      <TransactionList />
      <TransactionChart />
      <TransactionLineChart />
    </div>
  );
};

export default TransactionPage;