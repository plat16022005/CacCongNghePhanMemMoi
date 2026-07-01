import { useState, useEffect } from 'react';

const WISHLIST_KEY = 'wishlist_apartments';

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) {
        setWishlistIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Lỗi khi đọc wishlist từ localStorage", e);
    }
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlistIds(prev => {
      let newWishlist;
      if (prev.includes(id)) {
        newWishlist = prev.filter(item => item !== id);
      } else {
        newWishlist = [...prev, id];
      }
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(newWishlist));
      } catch (e) {
        console.error("Lỗi khi lưu wishlist", e);
      }
      return newWishlist;
    });
  };

  const isWishlisted = (id: string) => {
    return wishlistIds.includes(id);
  };

  return {
    wishlistIds,
    toggleWishlist,
    isWishlisted
  };
}
