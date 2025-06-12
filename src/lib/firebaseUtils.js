// src/lib/firebaseUtils.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export async function getRestaurantMenuData(restaurantUid) {
  if (!restaurantUid) {
    console.error("Hata: restaurantUid boş olamaz.");
    return null;
  }

  const menuDocRef = doc(db, "RestaurantMenu", restaurantUid);
  try {
    const docSnap = await getDoc(menuDocRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn(`Uyarı: '${restaurantUid}' UID'sine sahip restoran menüsü bulunamadı.`);
      return null;
    }
  } catch (error) {
    console.error("Hata: Menü verileri çekilirken bir sorun oluştu:", error);
    return null;
  }
}

export function processRawMenuData(rawMenuData) {
  if (!rawMenuData) {
    console.warn("processRawMenuData: rawMenuData boş veya tanımsız geldi.");
    return { categorizedMenu: {} };
  }

  const categorizedMenu = {};
  const specialFields = ['restaurantName', 'defaultCountry', 'totalCountries', 'totalMenus'];

  // rawMenuData'nın her alanını gez
  for (const fieldKey in rawMenuData) {
    if (rawMenuData.hasOwnProperty(fieldKey) && !specialFields.includes(fieldKey)) {
      const fieldData = rawMenuData[fieldKey]; // Bu bir kategori map'i veya doğrudan bir menü öğesi olabilir.

      // Firebase yapısına göre: fieldData'nın kendisi bir kategori map'i ise
      if (typeof fieldData === 'object' && fieldData !== null && !fieldData.name && !fieldData.category) {
        // Bu bir kategori map'idir (örn: pide_cesitleri, corba_mercimek).
        // Bu map'in altındaki menü öğelerini gez.
        for (const itemKey in fieldData) {
          if (fieldData.hasOwnProperty(itemKey)) {
            const menuItem = fieldData[itemKey];

            if (typeof menuItem === 'object' && menuItem !== null && menuItem.name && menuItem.category) {
              const categoryName = menuItem.category; // Menü öğesinin içindeki category değerini kullan

              if (!categorizedMenu[categoryName]) {
                categorizedMenu[categoryName] = [];
              }
              categorizedMenu[categoryName].push(menuItem);
            }
          }
        }
      } else if (typeof fieldData === 'object' && fieldData !== null && fieldData.name && fieldData.category) {
        // Bu doğrudan bir menü öğesidir (Firebase'de bazen kategorisiz eklenebilir).
        // Ancak sizin yapınızda kategorili olduğu için bu blok büyük ihtimalle çalışmayacak.
        // Yine de defensive programming için tutabiliriz.
        const categoryName = fieldData.category;
        if (!categorizedMenu[categoryName]) {
          categorizedMenu[categoryName] = [];
        }
        categorizedMenu[categoryName].push(fieldData);
      }
    }
  }

  // Her kategorideki menü öğelerini dateOfCreation'a göre sırala (eğer varsa)
  for (const categoryName in categorizedMenu) {
    categorizedMenu[categoryName].sort((a, b) => {
      const dateA = a.dateOfCreation ? new Date(a.dateOfCreation).getTime() : 0;
      const dateB = b.dateOfCreation ? new Date(b.dateOfCreation).getTime() : 0;
      return dateA - dateB;
    });
  }

  console.log("İşlenmiş menü verisi (categorizedMenu):", categorizedMenu);
  return { categorizedMenu };
}