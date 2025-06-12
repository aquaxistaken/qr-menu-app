// restaurant-menu-app/src/app/[restaurantUid]/page.jsx
import React from 'react';
import { getRestaurantMenuData, processRawMenuData } from '@/lib/firebaseUtils';
import MenuClientComponent from './MenuClientComponent';

export async function generateMetadata({ params }) {
  // BURADA await EKLEYİN - page.jsx:8
  const { restaurantUid } = await params; 
  let restaurantName = restaurantUid;

  try {
    const rawMenuData = await getRestaurantMenuData(restaurantUid);
    if (rawMenuData && rawMenuData.restaurantName) {
      restaurantName = rawMenuData.restaurantName;
    }
  } catch (error) {
    console.error("Metadata için restoran adı çekilirken hata:", error);
  }

  return {
    title: `${restaurantName} Menüsü | Restaurant Menu`,
    description: `${restaurantName} restoranının güncel menüsünü keşfedin.`,
  };
}

export default async function RestaurantMenuPage({ params }) {
  // BURADA await EKLEYİN - page.jsx:26 (sizin dosyanızda line 34 olabilir)
  const { restaurantUid } = await params;

  let processedMenu = {};
  let errorMessage = null;
  let restaurantActualName = restaurantUid; 

  try {
    const rawMenuData = await getRestaurantMenuData(restaurantUid);
    console.log(`Firebase'den gelen ham veri (${restaurantUid}):`, rawMenuData);
    if (rawMenuData) {
      if (rawMenuData.restaurantName) {
        restaurantActualName = rawMenuData.restaurantName;
      }
      const { categorizedMenu } = processRawMenuData(rawMenuData);
      processedMenu = categorizedMenu;
    } else {
      errorMessage = "Restoran menüsü bulunamadı veya bir sorun oluştu.";
    }
  } catch (error) {
    console.error("Menü yüklenirken hata:", error);
    errorMessage = "Menü yüklenirken beklenmeyen bir hata oluştu.";
  }

  return (
    <MenuClientComponent
      initialMenuData={processedMenu}
      errorMessage={errorMessage}
      restaurantUid={restaurantUid}
      restaurantName={restaurantActualName}
    />
  );
}