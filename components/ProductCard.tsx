import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Product } from '../types';

interface ProductCardProps {
  item: Product;
  quantityInCart: number;
  onAdd: () => void;
  onRemove: () => void;
}

const getProductImage = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('milk') || lower.includes('dairy') || lower.includes('cheese') || lower.includes('butter') || lower.includes('yogurt')) 
    return 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80';
  if (lower.includes('dhal') || lower.includes('dal') || lower.includes('lentil') || lower.includes('pulse') || lower.includes('beans')) 
    return 'https://images.unsplash.com/photo-1585995536551-7ecdb650eb1c?auto=format&fit=crop&w=200&q=80';
  if (lower.includes('apple') || lower.includes('fruit') || lower.includes('banana') || lower.includes('orange') || lower.includes('berry')) 
    return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=200&q=80';
  if (lower.includes('bread') || lower.includes('bakery') || lower.includes('bun') || lower.includes('loaf')) 
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80';
  if (lower.includes('egg')) 
    return 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=200&q=80';
  if (lower.includes('snack') || lower.includes('chip') || lower.includes('crisp') || lower.includes('cookie') || lower.includes('biscuit') || lower.includes('chocolate')) 
    return 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=200&q=80';
  if (lower.includes('veg') || lower.includes('tomato') || lower.includes('onion') || lower.includes('potato') || lower.includes('carrot') || lower.includes('spinach') || lower.includes('garlic')) 
    return 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=200&q=80';
  if (lower.includes('meat') || lower.includes('chicken') || lower.includes('beef') || lower.includes('pork') || lower.includes('fish')) 
    return 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=200&q=80';
  if (lower.includes('water') || lower.includes('juice') || lower.includes('drink') || lower.includes('beverage') || lower.includes('soda')) 
    return 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80';
  if (lower.includes('rice') || lower.includes('grain') || lower.includes('wheat') || lower.includes('flour') || lower.includes('pasta') || lower.includes('noodle')) 
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80';
  
  // Fallback pool
  const pool = [
    'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'
  ];
  const idx = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % pool.length;
  return pool[idx];
};

const ProductCard: React.FC<ProductCardProps> = ({ item, quantityInCart, onAdd, onRemove }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Pinch-to-zoom states
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastTouchRef = useRef({ dist: 0, x: 0, y: 0 });

  const imageUrl = getProductImage(item.name);
  const highResImageUrl = imageUrl.replace('&w=200', '&w=1000');

  const handleOpen = () => {
    setIsRendered(true);
    // Use requestAnimationFrame to ensure the element is in the DOM before animating
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsRendered(false);
      setScale(1);
      setPos({ x: 0, y: 0 });
    }, 300); // Wait for transition to finish
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchRef.current.dist = dist;
    } else if (e.touches.length === 1 && scale > 1) {
      lastTouchRef.current.x = e.touches[0].clientX - pos.x;
      lastTouchRef.current.y = e.touches[0].clientY - pos.y;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = dist / lastTouchRef.current.dist;
      const newScale = Math.min(Math.max(1, scale * delta), 4);
      setScale(newScale);
      lastTouchRef.current.dist = dist;
    } else if (e.touches.length === 1 && scale > 1) {
      setPos({
        x: e.touches[0].clientX - lastTouchRef.current.x,
        y: e.touches[0].clientY - lastTouchRef.current.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Snap back if scaled out or just reset pos if scale is 1
    if (scale <= 1) {
      setScale(1);
      setPos({ x: 0, y: 0 });
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const modalContent = isRendered ? (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm transition-opacity duration-300 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
      onClick={handleClose}
    >
      <div 
        className={`relative w-full max-w-lg max-h-[90vh] flex flex-col items-center transition-all duration-300 ease-out ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`} 
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute -top-14 right-0 text-white/90 hover:text-white p-2.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all active:scale-95 z-10"
          onClick={handleClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div 
          className="relative w-full flex items-center justify-center bg-transparent rounded-2xl touch-none overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <img
            src={highResImageUrl}
            alt={item.name}
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
            className="max-w-full w-auto h-auto max-h-[65vh] object-contain rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)] pointer-events-none origin-center"
          />
        </div>
        
        <div className="mt-5 text-center px-4 w-full relative">
          <h3 className="text-white font-extrabold text-2xl mb-1 drop-shadow-md">{item.name}</h3>
          <p className="text-gray-300 text-sm font-medium drop-shadow-md">₹{item.price.toFixed(2)} • {item.weight}</p>
          <p className="text-gray-400 text-sm mt-3 line-clamp-3 max-w-md mx-auto leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="py-4 px-2 flex justify-between gap-3">
      <div className="flex-1">
        {item.isOrganic && (
          <div className="mb-1 flex items-center gap-1">
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              Organic 🌱
            </span>
          </div>
        )}
        <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
        
        <div className="flex items-center gap-2 mt-1">
          <p className="font-bold text-gray-900 text-xs">₹{item.price.toFixed(2)}</p>
          <span className="text-gray-400 text-xs font-medium">• {item.weight}</span>
        </div>
        
        <p className="text-gray-400 text-[11px] mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
        
        <div className="mt-3 w-24">
          {quantityInCart === 0 ? (
            <button 
              onClick={onAdd}
              className="w-full py-1.5 text-green-700 font-extrabold uppercase text-xs bg-white border border-green-300 rounded-lg shadow-[0_2px_12px_rgba(34,197,94,0.2)] hover:bg-green-50 hover:border-green-400 active:scale-90 active:bg-green-100 transition-all duration-200"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center justify-between px-1.5 py-1.5 bg-green-50 border border-green-400 rounded-lg text-green-700 font-bold shadow-[0_2px_12px_rgba(34,197,94,0.2)]">
              <button 
                onClick={onRemove} 
                className="w-7 h-5 flex items-center justify-center text-lg leading-none active:scale-75 active:bg-green-200 rounded transition-all duration-200"
              >
                -
              </button>
              <span className="text-xs select-none w-4 text-center">{quantityInCart}</span>
              <button 
                onClick={onAdd} 
                className="w-7 h-5 flex items-center justify-center text-lg leading-none active:scale-75 active:bg-green-200 rounded transition-all duration-200"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div 
        className="relative w-28 h-28 flex-shrink-0 cursor-pointer group"
        onClick={handleOpen}
      >
        <img 
          src={imageUrl} 
          alt={item.name} 
          className="w-full h-full object-cover rounded-xl shadow-sm border border-gray-100 group-hover:opacity-90 transition-opacity"
          loading="lazy"
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-1.5 right-1.5 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-gray-400 active:scale-90 transition-all z-10"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-500">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-500 hover:text-red-400 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          )}
        </button>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 rounded-xl transition-opacity pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-white drop-shadow-md">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
        </div>
      </div>

      {/* Render modal in portal to ensure it overlays everything */}
      {typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent}
    </div>
  );
};

export default ProductCard;