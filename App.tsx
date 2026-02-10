import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import StoreCard from './components/StoreCard';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import AIAssistant from './components/AIAssistant';
import Tracking from './components/Tracking';
import Profile from './components/Profile';
import { ArrowLeftIcon, StarIcon, HomeIcon, SparklesIcon, CartIcon, SearchIcon } from './components/Icons';
import { Store, InventoryCategory, CartItem, ViewState, Product } from './types';
import { generateStores, generateInventory } from './services/geminiService';

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

const promotionalOffers = [
  { id: 1, title: '50% OFF', subtitle: 'On your first grocery order', code: 'WELCOME50', bg: 'bg-gradient-to-r from-orange-500 to-red-500' },
  { id: 2, title: 'FREE Delivery', subtitle: 'On orders above ₹499', code: 'FREEDEL', bg: 'bg-gradient-to-r from-blue-500 to-indigo-500' },
  { id: 3, title: 'Flat ₹100 Back', subtitle: 'Using Paytm Wallet', code: 'PAYTM100', bg: 'bg-gradient-to-r from-teal-400 to-emerald-500' },
  { id: 4, title: 'Buy 1 Get 1', subtitle: 'On Select Fresh Fruits', code: 'BOGOFRESH', bg: 'bg-gradient-to-r from-purple-500 to-pink-500' },
];

const groceryCategories = [
  { name: 'Fresh Fruits', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=100&q=80' },
  { name: 'Vegetables', img: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=100&q=80' },
  { name: 'Dairy & Milk', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=100&q=80' },
  { name: 'Snacks', img: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=100&q=80' },
  { name: 'Meat', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=100&q=80' },
  { name: 'Beverages', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=100&q=80' }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [location, setLocation] = useState('Bangalore, India');
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [sortByRating, setSortByRating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryCategory[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastOrderStoreName, setLastOrderStoreName] = useState<string>('');

  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-slide effect for the offers carousel
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (view === 'home') {
      interval = setInterval(() => {
        if (carouselRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
          // If we reached the end of the scroll container, reset to the beginning
          if (scrollLeft + clientWidth >= scrollWidth - 20) {
            carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Otherwise, scroll right by roughly the width of one card (300px)
            carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
          }
        }
      }, 3000); // Slide every 3 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view]);

  useEffect(() => {
    const loadStores = async () => {
      setIsLoadingStores(true);
      const data = await generateStores(location);
      setStores(data);
      setIsLoadingStores(false);
    };
    loadStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleStoreClick = async (store: Store) => {
    setSelectedStore(store);
    setView('store');
    setIsLoadingInventory(true);
    setInventoryData([]);
    
    const inventory = await generateInventory(store.name, store.categories);
    setInventoryData(inventory);
    setIsLoadingInventory(false);
  };

  const handleAddToCart = useCallback((item: Product, storeId: string, storeName: string) => {
    setCart(prevCart => {
      if (prevCart.length > 0 && prevCart[0].storeId !== storeId) {
        if (window.confirm("Your cart contains items from another store. Do you want to discard them and add this item?")) {
          return [{ product: item, quantity: 1, storeId, storeName }];
        }
        return prevCart;
      }
      const existingItem = prevCart.find(c => c.product.id === item.id);
      if (existingItem) {
        return prevCart.map(c => 
          c.product.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prevCart, { product: item, quantity: 1, storeId, storeName }];
    });
  }, []);

  const handleRemoveFromCart = useCallback((itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(c => c.product.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(c => 
          c.product.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
        );
      }
      return prevCart.filter(c => c.product.id !== itemId);
    });
  }, []);

  const handleOrderSuccess = useCallback((storeName: string) => {
    setLastOrderStoreName(storeName);
    setCart([]);
    setView('tracking');
  }, []);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Derive unique store categories for the filter
  const allStoreCategories = Array.from(new Set(stores.flatMap(store => store.categories)));

  // Filter and sort stores
  const filteredStores = stores.filter(store => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = store.name.toLowerCase().includes(query) ||
                          store.categories.some(cat => cat.toLowerCase().includes(query));
    const matchesCategory = selectedCategoryFilter ? store.categories.includes(selectedCategoryFilter) : true;
    return matchesSearch && matchesCategory;
  });

  const displayedStores = sortByRating 
    ? [...filteredStores].sort((a, b) => b.rating - a.rating)
    : filteredStores;

  const renderHome = () => (
    <div className="pb-6 bg-gray-50 min-h-full">
      <Header 
        location={location} 
        onLocationChange={setLocation} 
        onProfileClick={() => setView('profile')} 
      />
      <div className="px-4 py-4">
        
        {/* Sliding Promotional Offers Carousel */}
        <div 
          ref={carouselRef}
          className="mb-6 -mx-4 px-4 overflow-x-auto no-scrollbar snap-x snap-mandatory flex gap-4 pb-2"
        >
          {promotionalOffers.map((offer) => (
            <div 
              key={offer.id} 
              className={`snap-center shrink-0 w-[85%] sm:w-[280px] h-[130px] ${offer.bg} rounded-2xl p-5 text-white flex flex-col justify-center relative overflow-hidden shadow-sm`}
            >
               {/* Decorative background blobs */}
               <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none"></div>
               <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-black/10 rounded-full pointer-events-none"></div>
               
               <h3 className="text-2xl font-extrabold mb-1 drop-shadow-sm">{offer.title}</h3>
               <p className="text-sm font-medium opacity-90 mb-3 drop-shadow-sm">{offer.subtitle}</p>
               
               <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider w-max shadow-sm">
                 Code: {offer.code}
               </div>
            </div>
          ))}
          {/* Invisible spacer to allow full scroll to the end with padding */}
          <div className="w-1 shrink-0 snap-end"></div>
        </div>

        {/* Horizontal scroll categories */}
        <div className="mb-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">What do you need today?</h2>
          <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
            {groceryCategories.map((cat, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-gray-700">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-extrabold text-gray-900">Supermarkets to explore</h2>
          <button 
            onClick={() => setSortByRating(prev => !prev)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${sortByRating ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300 shadow-sm'}`}
          >
            Rating High to Low
            {sortByRating && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 ml-0.5">
                <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search stores or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand shadow-sm transition-shadow"
            />
          </div>
          
          {!isLoadingStores && allStoreCategories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setSelectedCategoryFilter(null)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${!selectedCategoryFilter ? 'bg-gray-900 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 active:bg-gray-50'}`}
              >
                All
              </button>
              {allStoreCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedCategoryFilter === cat ? 'bg-gray-900 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 active:bg-gray-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {isLoadingStores ? (
          <div className="flex flex-col">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-full bg-white mb-6 rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col animate-pulse">
                {/* Image placeholder */}
                <div className="w-full h-48 bg-gray-200 flex-shrink-0"></div>
                
                {/* Rating bar placeholder */}
                <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 border-b border-gray-100">
                  <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-8 bg-gray-200 rounded"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded ml-auto"></div>
                </div>
                
                {/* Content placeholder */}
                <div className="px-4 pt-4 pb-5 flex flex-col flex-grow gap-3">
                  <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="h-4 bg-gray-200 rounded-md w-20"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedStores.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <SearchIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-1">No stores found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategoryFilter(null); }}
              className="mt-4 text-brand font-bold text-sm bg-brand/10 px-4 py-2 rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {displayedStores.map(store => (
              <StoreCard 
                key={store.id} 
                store={store} 
                onClick={handleStoreClick} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStore = () => {
    if (!selectedStore) return null;

    return (
      <div className="bg-gray-50 min-h-full pb-6 relative flex flex-col">
        {/* Full width immersive header */}
        <div className="relative h-56 w-full flex-shrink-0">
          <img src={getStoreImage(selectedStore.id)} alt={selectedStore.name} className="w-full h-full object-cover" />
          <button onClick={() => setView('home')} className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur shadow-md rounded-full flex items-center justify-center active:scale-95 transition-transform z-10">
            <ArrowLeftIcon className="w-5 h-5 text-gray-800" />
          </button>
        </div>
        
        {/* Floating details card */}
        <div className="px-4 -mt-10 relative z-10">
          <div className="bg-white rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] p-4 border border-gray-100">
            <h1 className="text-xl font-extrabold text-gray-900 mb-1">{selectedStore.name}</h1>
            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800 mb-2">
              <StarIcon className="w-4 h-4 text-green-600" />
              <span>{selectedStore.rating} (Customer Reviews)</span>
            </div>
            <p className="text-gray-500 text-xs mb-2">{selectedStore.categories.join(', ')}</p>
            <div className="flex gap-4 text-xs font-bold text-gray-700 bg-gray-50 p-2 rounded-lg">
               <div className="flex items-center gap-1"><span className="text-gray-400">⚡</span> {selectedStore.deliveryTime}</div>
               <div className="flex items-center gap-1"><span className="text-gray-400">🛒</span> {selectedStore.minOrder}</div>
            </div>
          </div>
        </div>

        {/* Inventory Items */}
        <div className="px-4 mt-6">
           {isLoadingInventory ? (
              <div className="space-y-6 mt-4">
                 {[1, 2].map(cat => (
                   <div key={cat} className="animate-pulse">
                     <div className="h-6 bg-gray-200 w-32 rounded mb-4"></div>
                     <div className="space-y-6">
                        {[1, 2, 3].map(item => (
                           <div key={item} className="flex gap-3">
                              <div className="flex-1 space-y-2 py-2">
                                <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
                                <div className="h-3 bg-gray-200 w-1/4 rounded"></div>
                              </div>
                              <div className="w-28 h-28 bg-gray-200 rounded-xl"></div>
                           </div>
                        ))}
                     </div>
                   </div>
                 ))}
              </div>
           ) : (
             inventoryData.map((category, idx) => (
               <div key={idx} className="mb-8">
                 <h3 className="text-lg font-extrabold text-gray-900 mb-4 px-1">{category.category}</h3>
                 <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-2">
                   {category.items.map((item, itemIdx) => {
                     const cartItem = cart.find(c => c.product.id === item.id);
                     return (
                       <div key={item.id} className={itemIdx !== category.items.length - 1 ? "border-b border-gray-100" : ""}>
                         <ProductCard 
                           item={item}
                           quantityInCart={cartItem?.quantity || 0}
                           onAdd={() => handleAddToCart(item, selectedStore.id, selectedStore.name)}
                           onRemove={() => handleRemoveFromCart(item.id)}
                         />
                       </div>
                     );
                   })}
                 </div>
               </div>
             ))
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-[100dvh] sm:w-[393px] sm:h-[852px] bg-white sm:rounded-[2.5rem] sm:border-[8px] sm:border-gray-800 sm:shadow-2xl relative flex flex-col overflow-hidden">
      
      {/* Scrollable Main Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        {view === 'home' && renderHome()}
        {view === 'store' && renderStore()}
        {view === 'cart' && <Cart cart={cart} onAdd={handleAddToCart} onRemove={handleRemoveFromCart} onNavigate={setView} onOrderSuccess={handleOrderSuccess} />}
        {view === 'ai' && <AIAssistant />}
        {view === 'tracking' && <Tracking storeName={lastOrderStoreName} onNavigate={setView} />}
        {view === 'profile' && <Profile onNavigate={setView} />}
      </main>

      {/* Sticky Quick Cart Footer (Shown when browsing inventory) */}
      {cart.length > 0 && view === 'store' && (
        <div className="absolute bottom-[76px] left-4 right-4 bg-green-600 text-white px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.2)] flex justify-between items-center z-40 rounded-xl animate-fade-in-up">
           <div className="flex flex-col">
             <span className="font-extrabold text-sm">{cartItemCount} item{cartItemCount > 1 ? 's' : ''} added</span>
             <span className="text-[10px] opacity-90 font-medium tracking-wide uppercase">Extra charges may apply</span>
           </div>
           <button onClick={() => setView('cart')} className="font-bold flex items-center gap-1 text-white text-sm bg-black/10 px-3 py-1.5 rounded-lg active:bg-black/20">
             View Cart
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
           </button>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {view !== 'tracking' && view !== 'profile' && (
        <nav className="bg-white border-t border-gray-100 flex justify-around items-center h-[65px] px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.04)] relative z-50 flex-shrink-0">
           <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 px-4 py-1 rounded-full ${view === 'home' ? 'text-brand' : 'text-gray-400'}`}>
             <HomeIcon className="w-6 h-6" />
             <span className="text-[10px] font-bold">Nim Basket</span>
           </button>
           
           <button onClick={() => setView('home')} className="flex flex-col items-center gap-1 px-4 py-1 rounded-full text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.999 2.999 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.999 2.999 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>
             <span className="text-[10px] font-bold">Categories</span>
           </button>

           <button onClick={() => setView('ai')} className={`flex flex-col items-center gap-1 px-4 py-1 rounded-full ${view === 'ai' ? 'text-brand' : 'text-gray-400'}`}>
             <SparklesIcon className="w-6 h-6" />
             <span className="text-[10px] font-bold">Genie</span>
           </button>

           <button onClick={() => setView('cart')} className={`flex flex-col items-center gap-1 px-4 py-1 rounded-full relative ${view === 'cart' ? 'text-brand' : 'text-gray-400'}`}>
             <CartIcon className="w-6 h-6" />
             <span className="text-[10px] font-bold">Cart</span>
             {cartItemCount > 0 && (
               <div className="absolute top-0 right-2 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold border border-white">
                 {cartItemCount}
               </div>
             )}
           </button>
        </nav>
      )}
    </div>
  );
};

export default App;