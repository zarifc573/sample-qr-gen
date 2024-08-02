
import React, { useState, useEffect } from 'react';
import { ref, set, onValue, remove } from 'firebase/database';
import { db, storage } from '../../firebase';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { Link } from 'react-router-dom';

const ScannerAndForm = () => {
  const [scanResult, setScanResult] = useState(null);
  const [productImage, setProductImage] = useState('');
  const [description, setDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });
    scanner.render(handleScanSuccess, handleScanError);

    const productsRef = ref(db, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(Object.entries(data).map(([key, value]) => ({ ...value, key })));
        console.log('Products list:', Object.entries(data).map(([key, value]) => ({ ...value, key })));
      }
    });

    return () => {
      scanner.clear().catch(err => console.error('Failed to clear scanner', err));
      unsubscribe();
    };
  }, []);

  const handleScanSuccess = (result) => {
    setScanResult(result);
  };

  const handleScanError = (err) => {
    console.warn(err);
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const uploadPhoto = async () => {
    if (photo) {
      const photoRef = storageRef(storage, `photos/${Date.now()}_${photo.name}_${v4()}`);
      const snapshot = await uploadBytes(photoRef, photo);
      const url = await getDownloadURL(snapshot.ref);
      console.log('Uploaded photo URL:', url); // Log the URL for debugging
      return url;
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadedPhotoURL = await uploadPhoto();
      await set(ref(db, 'products/' + Date.now()), {
        scanResult,
        productImage: uploadedPhotoURL || productImage,
        description,
        additionalInfo,
      });
      setProductImage('');
      setDescription('');
      setAdditionalInfo('');
      setPhoto(null);
      setSubmitted(true);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDelete = async (productId) => {
    console.log('Attempting to delete product with ID:', productId);
    try {
      await remove(ref(db, 'products/' + productId));
      setProducts((prevProducts) => prevProducts.filter(product => product.key !== productId));
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center p-4">
        {scanResult ? (
          <div>
            Success: <Link href={"http://" + scanResult}>{scanResult}</Link>
          </div>
        ) : (
          <div id="reader" />
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <label htmlFor="photo" className="capture-button">Take a Photo</label>
        <input type="file" id="photo" accept="image/*, video/*" capture="environment" onChange={handlePhotoChange} className="mb-2 p-2" />
        <input
          type="text"
          value={productImage}
          onChange={(e) => setProductImage(e.target.value)}
          placeholder="Product Image URL"
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Additional Information"
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
      {submitted && <p className="mt-4 text-green-500">Data submitted successfully!</p>}
   
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Submitted Products</h2>
        {products.length > 0 ? (
          <ul className="list-disc pl-5">
            {products.map((product) => (
              <li key={product.key} className="mb-4 border p-4 border-black">
                <p><strong>Scan Result:</strong> <a href={"http://" + product.scanResult} target="_blank" rel="noopener noreferrer">{product.scanResult}</a></p>
                {/* <p><strong>Image URL:</strong> {product.productImage}</p> */}
                {product.productImage ? (
                  <img src={product.productImage} alt="Product" className="w-32 h-32 object-cover" />
                ) : (
                  <span>No Image Available</span>
                )}
                <p><strong>Description:</strong> {product.description}</p>
                <p><strong>Additional Info:</strong> {product.additionalInfo}</p>
                <button
                  onClick={() => handleDelete(product.key)}
                  className="mt-2 p-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ScannerAndForm;
