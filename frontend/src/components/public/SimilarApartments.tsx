import { useState, useEffect } from 'react';
import type { Apartment } from '../../hooks/useApartments';
import ApartmentCard from './ApartmentCard';
import ApartmentCardSkeleton from './ApartmentCardSkeleton';

interface SimilarApartmentsProps {
  currentApartmentId: string;
  onBookViewing: (id: string) => void;
}

export default function SimilarApartments({ currentApartmentId, onBookViewing }: SimilarApartmentsProps) {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/apartments/${currentApartmentId}/similar`)
      .then(res => res.json())
      .then(result => {
        if (result.data) {
          setApartments(result.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentApartmentId]);

  if (loading) {
    return (
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-[#3a4a6b] mb-6">Căn hộ tương tự</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ApartmentCardSkeleton />
          <ApartmentCardSkeleton />
          <ApartmentCardSkeleton />
        </div>
      </div>
    );
  }

  if (apartments.length === 0) return null;

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-[#3a4a6b] mb-6">Căn hộ tương tự</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {apartments.map((apt, index) => (
          <ApartmentCard 
            key={apt._id} 
            apartment={apt} 
            index={index} 
            onBookViewing={onBookViewing}
          />
        ))}
      </div>
    </div>
  );
}
