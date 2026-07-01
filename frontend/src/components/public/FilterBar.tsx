import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [block, setBlock] = useState(searchParams.get('block') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentParams = Object.fromEntries(searchParams.entries());
      if (searchTerm) {
        currentParams.search = searchTerm;
      } else {
        delete currentParams.search;
      }
      setSearchParams(currentParams, { replace: true });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, setSearchParams]);

  const applyFilters = () => {
    const params: any = {};
    if (searchTerm) params.search = searchTerm;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (bedrooms) params.bedrooms = bedrooms;
    if (block) params.block = block;
    if (sortBy) params.sortBy = sortBy;
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setBlock('');
    setSortBy('');
    setSearchParams({});
  };

  const hasActiveFilters = minPrice || maxPrice || bedrooms || block || sortBy || searchParams.has('search');

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm p-4 mb-8 sticky top-4 z-40 transition-shadow hover:shadow-md">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            placeholder="Tìm kiếm số phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <select 
            value={minPrice} 
            onChange={(e) => setMinPrice(e.target.value)}
            className="block w-full pl-3 pr-8 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Giá từ</option>
            <option value="3000000">3 Triệu</option>
            <option value="5000000">5 Triệu</option>
            <option value="7000000">7 Triệu</option>
            <option value="10000000">10 Triệu</option>
          </select>

          <select 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)}
            className="block w-full pl-3 pr-8 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Giá đến</option>
            <option value="5000000">5 Triệu</option>
            <option value="7000000">7 Triệu</option>
            <option value="10000000">10 Triệu</option>
            <option value="15000000">15 Triệu</option>
          </select>

          <select 
            value={bedrooms} 
            onChange={(e) => setBedrooms(e.target.value)}
            className="block w-full pl-3 pr-8 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Số phòng ngủ</option>
            <option value="1">1 Phòng</option>
            <option value="2">2 Phòng</option>
            <option value="3">3 Phòng</option>
          </select>

          <select 
            value={block} 
            onChange={(e) => setBlock(e.target.value)}
            className="block w-full pl-3 pr-8 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tòa nhà</option>
            <option value="A">Block A</option>
            <option value="B">Block B</option>
            <option value="C">Block C</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-full pl-3 pr-8 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sắp xếp</option>
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="area_desc">Diện tích lớn</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={applyFilters}
            className="px-4 py-2.5 bg-[#3a4a6b] text-white rounded-xl text-sm font-medium hover:bg-[#2a3651] transition-colors flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" /> Lọc
          </button>
          
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="px-3 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center"
              title="Xóa bộ lọc"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
