import React from 'react';
import { Store } from '../types';
import { StarIcon } from './Icons';

interface StoreCardProps {
  store: Store;
  onClick: (store: Store) => void;
}

const getStoreImage = (id: string) => {
  const pool = [
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'
  ];
  const idx = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % pool.length;
  return pool[idx];
};

const StoreCard: React.FC<StoreCardProps> = ({ store, onClick }) => {
  const imageUrl = getStoreImage(store.id);

  return (
    <div 
      onClick={() => onClick(store)}
      className="w-full bg-white mb-6 cursor-pointer active:scale-[0.98] transition-transform duration-200 rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col"
    >
      <div className="relative w-full h-48 flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={store.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
        
        {store.offer && (
          <div className="absolute bottom-3 left-3 text-white font-extrabold text-xl tracking-tight">
            {store.offer}
          </div>
        )}
      </div>
      
      {/* Prominent Rating Div (Kept from previous requirement) */}
      <div className="bg-gray-900 text-white px-4 py-2.5 flex items-center gap-2">
        <StarIcon className="w-5 h-5 text-yellow-400" />
        <span className="font-bold text-base">{store.rating}</span>
        <span className="text-gray-400 text-xs font-medium uppercase tracking-wider ml-auto">Customer Rating</span>
      </div>
      
      <div className="px-4 pt-3 pb-4 flex flex-col flex-grow">
        <h3 className="font-bold text-xl text-gray-900 truncate mb-1">{store.name}</h3>
        
        <p className="text-gray-500 text-sm truncate">{store.categories.join(', ')}</p>
        
        <div className="flex items-center gap-4 mt-2.5 text-sm font-medium text-gray-700">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 text-base">⚡</span> {store.deliveryTime}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 text-base">🛒</span> {store.minOrder}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;