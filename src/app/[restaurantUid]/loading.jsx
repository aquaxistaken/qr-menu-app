// src/app/[restaurantUid]/loading.jsx
import React from 'react';

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Menü yükleniyor...</p>
    </div>
  );
}