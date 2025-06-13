// restaurant-menu-app/src/app/[restaurantUid]/page.jsx
import React from 'react';
import { getRestaurantMenuData, processRawMenuData } from '@/lib/firebaseUtils';
import MenuClientComponent from './MenuClientComponent';

// Metadata oluşturma fonksiyonu (SEO için)
export async function generateMetadata({ params }) {
  // params objesi zaten doğrudan değeri içerir, await'e gerek yok.
  const { restaurantUid } = params; 
  let restaurantName = restaurantUid; // Varsayılan olarak UID'yi kullan

  try {
    const rawMenuData = await getRestaurantMenuData(restaurantUid);
    if (rawMenuData && rawMenuData.restaurantName) {
      restaurantName = rawMenuData.restaurantName; // Firebase'den gelen adı kullan
    }
  } catch (error) {
    // Hataları sadece konsolda logla, metadata'yı engelleme
    console.error("Metadata için restoran adı çekilirken hata:", error);
  }

  return {
    title: `${restaurantName} Menüsü | Restaurant Menu`,
    description: `${restaurantName} restoranının güncel menüsünü keşfedin.`,
  };
}

// Ana sayfa bileşeni
export default async function RestaurantMenuPage({ params }) {
  // params objesi zaten doğrudan değeri içerir, await'e gerek yok.
  const { restaurantUid } = params;

  let processedMenu = {};
  let errorMessage = null;
  let restaurantActualName = restaurantUid; // Varsayılan olarak UID'yi kullan

  try {
    const rawMenuData = await getRestaurantMenuData(restaurantUid);
    // Geliştirme ve hata ayıklama için konsola ham veriyi yazdır
    console.log(`Firebase'den gelen ham veri (${restaurantUid}):`, rawMenuData);

    if (rawMenuData) {
      if (rawMenuData.restaurantName) {
        restaurantActualName = rawMenuData.restaurantName; // Firebase'den gelen adı kullan
      }
      // Ham veriyi menü kategorilerine ayır ve işle
      const { categorizedMenu } = processRawMenuData(rawMenuData);
      processedMenu = categorizedMenu;
    } else {
      // Eğer veri gelmezse hata mesajı set et
      errorMessage = "Restoran menüsü bulunamadı veya bir sorun oluştu. Lütfen URL'yi kontrol edin.";
    }
  } catch (error) {
    // Veri çekilirken oluşan tüm hataları yakala ve logla
    console.error("Menü yüklenirken hata:", error);
    errorMessage = "Menü yüklenirken beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
  }

  // Menü verilerini istemci bileşenine Props olarak aktar
  return (
    <MenuClientComponent
      initialMenuData={processedMenu}
      errorMessage={errorMessage}
      restaurantUid={restaurantUid}
      restaurantName={restaurantActualName}
    />
  );
}