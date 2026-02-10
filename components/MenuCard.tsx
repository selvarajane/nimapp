import React from 'react';
import { MenuItem } from '../types';

interface MenuCardProps {
  item: MenuItem;
  quantityInCart: number;
  onAdd: () => void;
  onRemove: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, quantityInCart, onAdd, onRemove }) => {
  const imageUrl = `https://picsum.photos/seed/${item.id}/200/200`;

  return (
    <div className="py-6 border-b border-gray-200 flex justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-4 h-4 border ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center rounded-sm`}>
            <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
          </div>
          {item.isVeg && <span className="text-xs font-bold text-green-600 bg-green-50 px-1 rounded">Bestseller</span>}
        </div>
        <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
        <p className="font-medium text-gray-800 mt-1">₹{item.price.toFixed(2)}</p>
        <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
      </div>
      
      <div className="relative w-32 h-32 flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={item.name} 
          className="w-full h-full object-cover rounded-xl shadow-sm"
          loading="lazy"
        />
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 shadow-md rounded-lg overflow-hidden bg-white w-24">
          {quantityInCart === 0 ? (
            <button 
              onClick={onAdd}
              className="w-full py-1.5 text-green-600 font-extrabold uppercase text-sm hover:bg-gray-50 transition-colors"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center justify-between px-2 py-1.5 bg-white text-green-600 font-bold">
              <button onClick={onRemove} className="w-6 text-xl hover:bg-gray-100 rounded">-</button>
              <span className="text-sm">{quantityInCart}</span>
              <button onClick={onAdd} className="w-6 text-xl hover:bg-gray-100 rounded">+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;