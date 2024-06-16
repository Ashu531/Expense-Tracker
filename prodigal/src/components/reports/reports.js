import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './reports.css';

const Reports = () => {
  const [totalExpensesPerCategory, setTotalExpensesPerCategory] = useState([]);
  const [monthlySpendingTrends, setMonthlySpendingTrends] = useState([]);

  useEffect(() => {
    fetchTotalExpensesPerCategory();
    fetchMonthlySpendingTrends();
  }, []);

  const fetchTotalExpensesPerCategory = () => {
    axios.get('http://localhost:8000/api/reports/total-expenses-per-category')
      .then(response => {
        setTotalExpensesPerCategory(response.data);
      })
      .catch(error => {
        console.error('Error fetching total expenses per category:', error);
      });
  };

  const fetchMonthlySpendingTrends = () => {
    axios.get('http://localhost:8000/api/reports/monthly-spending-trends')
      .then(response => {
        setMonthlySpendingTrends(response.data);
      })
      .catch(error => {
        console.error('Error fetching monthly spending trends:', error);
      });
  };

  return (
    <div className="reports-container">
      <h2>Reports</h2>
      <div className="chart-container">
        <h3>Total Expenses per Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={totalExpensesPerCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalAmount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-container">
        <h3>Monthly Spending Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlySpendingTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalAmount" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Reports;
