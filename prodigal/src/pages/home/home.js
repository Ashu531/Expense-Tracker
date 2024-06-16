import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Input, InputNumber, Select, notification, Tabs } from 'antd';
import ExpenseList from '../../components/expenselist/expenselist';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Reports from '../../components/reports/reports';
import './home.css';

const { Option } = Select;

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredCategory, setFilteredCategory] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, [filteredCategory]);

  const fetchExpenses = () => {
    const categoryQuery = filteredCategory ? `?category=${filteredCategory}` : '';
    axios.get(`http://localhost:8000/api/expenses${categoryQuery}`)
      .then(response => {
        setExpenses(response.data);
      })
      .catch(error => {
        console.error('Error fetching expenses:', error);
      });
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    form.resetFields();
    setSelectedDate(null);
    setIsModalVisible(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    form.setFieldsValue({
      ...expense,
      date: moment(expense.date).toDate(),
    });
    setSelectedDate(moment(expense.date).toDate());
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedDate(null);
  };

  const onFinish = (values) => {
    const expenseData = {
      amount: values.amount,
      category: values.category,
      date: moment(selectedDate).format('YYYY/MM/DD'),
      description: values.description,
    };

    if (editingExpense) {
      axios.put(`http://localhost:8000/api/expenses/${editingExpense._id}`, expenseData)
        .then(response => {
          notification.success({
            message: 'Expense Updated',
            description: 'Your expense has been successfully updated.',
          });
          setIsModalVisible(false);
          fetchExpenses();
        })
        .catch(error => {
          console.error('There was an error updating the expense!', error);
          notification.error({
            message: 'Error',
            description: 'There was an error updating your expense. Please try again.',
          });
        });
    } else {
      axios.post('http://localhost:8000/api/expenses', expenseData)
        .then(response => {
          notification.success({
            message: 'Expense Added',
            description: 'Your expense has been successfully added.',
          });
          form.resetFields();
          setIsModalVisible(false);
          fetchExpenses();
        })
        .catch(error => {
          console.error('There was an error adding the expense!', error);
          notification.error({
            message: 'Error',
            description: 'There was an error adding your expense. Please try again.',
          });
        });
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleDelete = (expenseId) => {
    axios.delete(`http://localhost:8000/api/expenses/${expenseId}`)
      .then(response => {
        setExpenses(expenses.filter(expense => expense._id !== expenseId));
        notification.success({
          message: 'Expense Deleted',
          description: 'Your expense has been successfully deleted.',
        });
      })
      .catch(error => {
        console.error('Error deleting expense:', error);
        notification.error({
          message: 'Error',
          description: 'There was an error deleting your expense. Please try again.',
        });
      });
  };

  const handleCategoryChange = (key) => {
    setFilteredCategory(key === 'All' ? null : key);
  };

  return (
    <div className='home-container'>
      <div className='header-content'>
        <h1>Expenses</h1>
        <Button type="primary" onClick={handleAddExpense}>
          Add Expense
        </Button>
      </div>
      <Tabs
        defaultActiveKey="All"
        onChange={handleCategoryChange}
        className="category-tabs"
        tabBarStyle={{ borderBottom: 'none' }}
      >
        <Tabs.TabPane tab="All" key="All" />
        <Tabs.TabPane tab="Food" key="Food" />
        <Tabs.TabPane tab="Transport" key="Transport" />
        <Tabs.TabPane tab="Entertainment" key="Entertainment" />
        <Tabs.TabPane tab="Health" key="Health" />
        <Tabs.TabPane tab="Others" key="Others" />
      </Tabs>
      <ExpenseList expenses={filteredCategory ? expenses.filter(expense => expense.category === filteredCategory) : expenses} onEdit={handleEdit} onDelete={handleDelete} />
      <Reports />
      <Modal
        title={editingExpense ? "Edit Expense" : "Add Expense"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="100%"
        bodyStyle={{ padding: '24px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter the amount!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select placeholder="Select a category">
              <Option value="Food">Food</Option>
              <Option value="Transport">Transport</Option>
              <Option value="Entertainment">Entertainment</Option>
              <Option value="Health">Health</Option>
              <Option value="Others">Others</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select the date!' }]}
          >
            <DatePicker 
              value={selectedDate} 
              onChange={handleDateChange} 
              format="y-MM-dd" 
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the description!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingExpense ? "Update Expense" : "Add Expense"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Home;
