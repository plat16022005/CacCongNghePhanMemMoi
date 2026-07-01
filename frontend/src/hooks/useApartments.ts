import { useState, useEffect, useCallback } from 'react';

export interface Apartment {
  _id: string;
  roomNumber: string;
  block: string;
  floor: number;
  rentalPrice: number;
  area: number;
  bedroomCount: number;
  bathroomCount: number;
  description: string;
  images: string[];
  status: string;
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UseApartmentsProps {
  initialPage?: number;
  initialLimit?: number;
}

export function useApartments({ initialPage = 1, initialLimit = 12 }: UseApartmentsProps = {}) {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: initialPage, limit: initialLimit, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildQueryString = (params: any) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });
    return query.toString();
  };

  const fetchApartments = useCallback(async (filters: any, isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      const qs = buildQueryString(filters);
      const res = await fetch(`/api/public/apartments?${qs}`);
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Lỗi tải dữ liệu');

      // The new API format returns { data, meta }
      if (result.data) {
        if (isLoadMore) {
          setApartments(prev => [...prev, ...result.data]);
        } else {
          setApartments(result.data);
        }
        setMeta(result.meta);
      } else {
        // Fallback for old API if any
        if (isLoadMore) {
           setApartments(prev => [...prev, ...result]);
        } else {
           setApartments(result);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (isLoadMore) setLoadingMore(false);
      else setLoading(false);
    }
  }, []);

  return {
    apartments,
    meta,
    loading,
    loadingMore,
    error,
    fetchApartments
  };
}
