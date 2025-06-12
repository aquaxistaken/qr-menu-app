// src/app/[restaurantUid]/MenuClientComponent.jsx
'use client';

import React, { useState, useEffect } from 'react';

export default function MenuClientComponent({
  initialMenuData = {},
  errorMessage = '',
  restaurantUid = '',
  restaurantName = '',
}) {
  const menuData = initialMenuData;

  const categories = Object.keys(menuData).filter(
    (cat) => menuData[cat]?.length > 0
  );

  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory((prev) => prev || categories[0]);
    }
  }, [categories]);

  if (errorMessage) {
    return (
      <div className="error-message">
        Hata: {errorMessage}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="no-menu-message">
        Bu restoran için henüz menü bulunmuyor.
      </div>
    );
  }

  return (
    <div className="menu-container">
      <h1 className="menu-title">
        {restaurantName || restaurantUid ? `${restaurantName || restaurantUid} Menüsü` : 'Restoran Menüsü'}
      </h1>

      <div className="category-buttons-container">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="menu-items-list">
        {selectedCategory && menuData[selectedCategory]?.length > 0 ? (
          menuData[selectedCategory].map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="menu-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Burayı dikkatlice kontrol edin, önceki hata bu kısımda olabilir */}
              {item.imageUrl && ( // Satır 58 civarı
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="menu-item-image"
                />
              )}
              <div className="menu-item-details">
                <h3 className="menu-item-name">{item.name}</h3>
                <p className="menu-item-description">{item.description}</p>
                <div className="menu-item-footer">
                  <span className="menu-item-price">{item.price} TL</span>
                  {item.dateOfCreation && (
                    <span className="menu-item-date">
                      Eklendi: {new Date(item.dateOfCreation).toLocaleDateString('tr-TR')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-category-message">
            <p>😔 Bu kategoride henüz menü öğesi bulunmuyor.</p>
            <p>Farklı bir kategori seçebilir veya daha sonra tekrar kontrol edebilirsiniz.</p>
          </div>
        )}
      </div>
    </div>
  );
}