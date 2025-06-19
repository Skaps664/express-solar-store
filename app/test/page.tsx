"use client"

// components/ApiTest.js
import React, { useEffect, useState } from 'react';

const ApiTest = () => {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/products?page=2&limit=1') // Replace with your real endpoint
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.text(); // or res.json() depending on your API
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>API Response:</h2>
      <p>{data}</p>
    </div>
  );
};

export default ApiTest;
