import React from 'react';
import { Restaurant } from '../types';
import { StarIcon } from './Icons';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: (restaurant: Restaurant) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  const imageUrl = `https://picsum.photos/seed/${restaurant.id}/400/250`;

  return (
    <div 
      onClick={() => onClick(restaurant)}
      className="w-full bg-white mb-6 cursor-pointer active:scale-[0.98] transition-transform duration-200 rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col"
    >
      <div className="relative w-full h-48 flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
        
        {restaurant.offer && (
          <div className="absolute bottom-3 left-3 text-white font-extrabold text-xl tracking-tight">
            {restaurant.offer}
          </div>
        )}
      </div>
      
      {/* Prominent Rating Div */}
      <div className="bg-gray-900 text-white px-4 py-2.5 flex items-center gap-2">
        <StarIcon className="w-5 h-5 text-yellow-400" />
        <span className="font-bold text-base">{restaurant.rating}</span>
        <span className="text-gray-400 text-xs font-medium uppercase tracking-wider ml-auto">Customer Rating</span>
      </div>
      
      <div className="px-4 pt-3 pb-4 flex flex-col flex-grow">
        <h3 className="font-bold text-xl text-gray-900 truncate mb-1">{restaurant.name}</h3>
        
        <p className="text-gray-500 text-sm truncate">{restaurant.cuisines.join(', ')}</p>
        
        <div className="flex items-center gap-4 mt-2.5 text-sm font-medium text-gray-700">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 text-base">🕒</span> {restaurant.deliveryTime}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 text-base">💵</span> {restaurant.costForTwo}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;