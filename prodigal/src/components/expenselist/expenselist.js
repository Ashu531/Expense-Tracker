import React from 'react';
import { Table, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './expenselist.css';

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Button type="danger" icon={<DeleteOutlined />} onClick={() => onDelete(record['_id'])} />
        </Space>
      ),
    },
  ];

  return (
    <div className="responsive-table-container">
      <Table
        columns={columns}
        dataSource={expenses}
        pagination={{ pageSize: 10 }}
        rowKey="id"
        className="responsive-table"
      />
    </div>
  );
};

export default ExpenseList;
