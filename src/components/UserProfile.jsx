"use client";
import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/firebase';

const UserProfile = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productsRef = ref(database, 'products/');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(Object.values(data));
      }
    });
  }, []);

  return (
    <div>
      <h1>Your Products</h1>
      {products.length ? (
        products.map(product => (
          <div key={product.scannedText}>
            <img src={product.productImage} alt={product.description} />
            <p>{product.description}</p>
            <p>{product.price}</p>
            <p>{product.category}</p>
            <p>Scanned Text: {product.scannedText}</p>
          </div>
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default UserProfile;
