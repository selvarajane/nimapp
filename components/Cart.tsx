import React, { useState } from 'react';
import { CartItem, ViewState } from '../types';
import { ArrowLeftIcon } from './Icons';

interface CartProps {
  cart: CartItem[];
  onAdd: (item: CartItem['product'], storeId: string, storeName: string) => void;
  onRemove: (itemId: string) => void;
  onNavigate: (view: ViewState) => void;
  onOrderSuccess?: (storeName: string) => void;
}

const getStoreThumbnail = (id: string) => {
  const pool = [
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80'
  ];
  const idx = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % pool.length;
  return pool[idx];
};

const initialSavedAddresses = [
  { id: 'home', type: 'Home', text: '123 Main Street, Apt 4B, New York, NY 10001', icon: '🏠' },
  { id: 'work', type: 'Work', text: '456 Corporate Blvd, Suite 200, New York, NY 10002', icon: '🏢' },
];

const Cart: React.FC<CartProps> = ({ cart, onAdd, onRemove, onNavigate, onOrderSuccess }) => {
  const [checkoutState, setCheckoutState] = useState<'cart' | 'address' | 'payment' | 'processing' | 'success'>('cart');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('home');
  const [customAddress, setCustomAddress] = useState<string>('');
  
  const [addresses, setAddresses] = useState(initialSavedAddresses);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editingAddressValue, setEditingAddressValue] = useState<string>('');

  const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = 49;
  const taxes = totalAmount * 0.05;
  const finalAmount = (totalAmount + deliveryFee + taxes).toFixed(2);
  const storeName = cart.length > 0 ? cart[0].storeName : '';
  const storeId = cart.length > 0 ? cart[0].storeId : '';

  const activeAddressText = selectedAddressId === 'custom' 
    ? customAddress 
    : addresses.find(a => a.id === selectedAddressId)?.text || '';

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    if (editingAddressId && editingAddressId !== id) {
      setEditingAddressId(null);
    }
  };

  const handleSaveEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddresses(prev => prev.map(a => a.id === id ? { ...a, text: editingAddressValue } : a));
    setEditingAddressId(null);
  };

  if (checkoutState === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 h-full bg-white text-center">
        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-500 mb-8 max-w-xs text-sm">Your payment of ₹{finalAmount} was successful. Your groceries from {storeName} will be prepared shortly.</p>
        <button
          onClick={() => {
            if (onOrderSuccess) {
              onOrderSuccess(storeName);
            } else {
              onNavigate('home');
            }
          }}
          className="bg-green-600 text-white font-bold py-3.5 px-8 rounded-xl w-full max-w-[250px] shadow-lg active:scale-95 transition-transform"
        >
          Track Order
        </button>
      </div>
    );
  }

  if (checkoutState === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white px-4">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-xl font-extrabold text-gray-900">Processing Payment</h2>
        <p className="text-sm text-gray-500 mt-2">Securing your transaction...</p>
      </div>
    );
  }

  if (checkoutState === 'address') {
    return (
      <div className="flex flex-col min-h-full bg-gray-50 pb-4 relative">
        <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-3">
          <button onClick={() => setCheckoutState('cart')} className="p-1 active:bg-gray-100 rounded-full">
            <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="font-bold text-lg text-gray-900">Select Address</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <h3 className="font-bold text-gray-800 px-1 text-sm uppercase tracking-wider">Saved Addresses</h3>
          
          <div className="space-y-3">
            {addresses.map((address) => (
              <div 
                key={address.id} 
                onClick={() => handleSelectAddress(address.id)} 
                className={`p-4 rounded-xl border-2 transition-colors cursor-pointer flex gap-3 ${selectedAddressId === address.id ? 'border-brand bg-brand/5' : 'border-gray-200 bg-white'}`}
              >
                <div className="text-2xl mt-0.5">{address.icon}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-800">{address.type}</span>
                    <div className="flex items-center gap-3">
                      {selectedAddressId === address.id && editingAddressId !== address.id && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddressId(address.id);
                            setEditingAddressValue(address.text);
                          }}
                          className="text-brand text-xs font-bold flex items-center gap-1 uppercase tracking-wide px-2 py-1 rounded hover:bg-brand/5 active:bg-brand/10 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                          Edit
                        </button>
                      )}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddressId === address.id ? 'border-brand' : 'border-gray-300'}`}>
                        {selectedAddressId === address.id && <div className="w-2.5 h-2.5 bg-brand rounded-full"></div>}
                      </div>
                    </div>
                  </div>
                  
                  {editingAddressId === address.id ? (
                    <div className="mt-2 animate-fade-in-up" onClick={e => e.stopPropagation()}>
                      <textarea
                        autoFocus
                        value={editingAddressValue}
                        onChange={e => setEditingAddressValue(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-brand shadow-sm transition-shadow"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddressId(null);
                          }}
                          className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => handleSaveEdit(address.id, e)}
                          disabled={editingAddressValue.trim().length < 5}
                          className="px-4 py-2 text-xs font-bold text-white bg-brand rounded-lg disabled:opacity-50 transition-colors shadow-sm"
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 leading-snug">{address.text}</p>
                  )}
                </div>
              </div>
            ))}

            <div 
              onClick={() => handleSelectAddress('custom')} 
              className={`p-4 rounded-xl border-2 transition-colors cursor-pointer flex gap-3 ${selectedAddressId === 'custom' ? 'border-brand bg-brand/5' : 'border-gray-200 bg-white'}`}
            >
              <div className="text-2xl mt-0.5">📍</div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-800">Add New Address</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddressId === 'custom' ? 'border-brand' : 'border-gray-300'}`}>
                    {selectedAddressId === 'custom' && <div className="w-2.5 h-2.5 bg-brand rounded-full"></div>}
                  </div>
                </div>
                {selectedAddressId === 'custom' && (
                  <div className="mt-2 animate-fade-in-up">
                    <textarea
                      autoFocus
                      value={customAddress}
                      onChange={e => setCustomAddress(e.target.value)}
                      placeholder="Enter your full delivery address..."
                      className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-brand shadow-sm transition-shadow"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] border-t border-gray-100 mt-auto z-20">
          <button
            className="w-full bg-brand text-white font-bold py-3.5 rounded-xl text-lg flex justify-center items-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100"
            disabled={
              (selectedAddressId === 'custom' && customAddress.trim().length < 5) || 
              editingAddressId !== null
            }
            onClick={() => setCheckoutState('payment')}
          >
            Confirm Address
          </button>
        </div>
      </div>
    );
  }

  if (checkoutState === 'payment') {
    return (
      <div className="flex flex-col min-h-full bg-gray-50 pb-4 relative">
         <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-3">
           <button onClick={() => setCheckoutState('address')} className="p-1 active:bg-gray-100 rounded-full">
             <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
           </button>
           <h1 className="font-bold text-lg text-gray-900">Payment Options</h1>
         </div>

         <div className="flex-1 overflow-y-auto p-4">
            {/* Address Summary */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 flex items-start gap-3">
              <div className="text-xl mt-0.5">📍</div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Delivering To</h3>
                  <button onClick={() => setCheckoutState('address')} className="text-brand text-xs font-bold">Change</button>
                </div>
                <p className="text-sm text-gray-800 mt-1 line-clamp-2">{activeAddressText}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 text-center">
               <p className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">Amount to Pay</p>
               <p className="text-4xl font-extrabold text-gray-900">₹{finalAmount}</p>
            </div>

            <h3 className="font-bold text-gray-800 mb-3 px-1 text-sm uppercase tracking-wider">Select Method</h3>
            <div className="space-y-3">
               {/* Card */}
               <div onClick={() => setSelectedMethod('card')} className={`p-4 rounded-xl border-2 transition-colors cursor-pointer flex flex-col gap-3 ${selectedMethod === 'card' ? 'border-brand bg-brand/5' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center border border-blue-200 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-blue-600">
                        <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                        <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-bold text-gray-800 flex-1">Credit / Debit Card</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'card' ? 'border-brand' : 'border-gray-300'}`}>
                       {selectedMethod === 'card' && <div className="w-2.5 h-2.5 bg-brand rounded-full"></div>}
                    </div>
                  </div>
                  {selectedMethod === 'card' && (
                     <div className="pt-3 border-t border-gray-200/60 mt-1 flex flex-col gap-2.5">
                        <input type="text" placeholder="Card Number (e.g. 4111 1111 1111)" className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-brand" />
                        <div className="flex gap-2">
                           <input type="text" placeholder="MM/YY" className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium w-1/2 focus:outline-none focus:border-brand" />
                           <input type="password" placeholder="CVV" maxLength={3} className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium w-1/2 focus:outline-none focus:border-brand" />
                        </div>
                     </div>
                  )}
               </div>

               {/* UPI */}
               <div onClick={() => setSelectedMethod('upi')} className={`p-4 rounded-xl border-2 transition-colors cursor-pointer flex items-center gap-3 ${selectedMethod === 'upi' ? 'border-brand bg-brand/5' : 'border-gray-200 bg-white'}`}>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center border border-purple-200 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-purple-600">
                        <path fillRule="evenodd" d="M3 4.5A1.5 1.5 0 014.5 3h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5zm13.5-1.5a.75.75 0 01.75-.75h4.5A1.5 1.5 0 0123.25 4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 01-.75-.75zM3 19.5A1.5 1.5 0 004.5 21h4.5a.75.75 0 000-1.5h-4.5v-4.5a.75.75 0 00-1.5 0v4.5zm18 0a1.5 1.5 0 01-1.5 1.5h-4.5a.75.75 0 010-1.5h4.5v-4.5a.75.75 0 011.5 0v4.5zM7.5 7.5A1.5 1.5 0 006 9v6a1.5 1.5 0 001.5 1.5h9A1.5 1.5 0 0018 15V9a1.5 1.5 0 00-1.5-1.5h-9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-bold text-gray-800 flex-1">UPI / Mobile Wallet</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'upi' ? 'border-brand' : 'border-gray-300'}`}>
                       {selectedMethod === 'upi' && <div className="w-2.5 h-2.5 bg-brand rounded-full"></div>}
                    </div>
               </div>

               {/* COD */}
               <div onClick={() => setSelectedMethod('cod')} className={`p-4 rounded-xl border-2 transition-colors cursor-pointer flex items-center gap-3 ${selectedMethod === 'cod' ? 'border-brand bg-brand/5' : 'border-gray-200 bg-white'}`}>
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg flex items-center justify-center border border-emerald-200 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-emerald-600">
                        <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                        <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                        <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-1.5 0v.947c-4.996-1.157-10.158-1.697-15.3-1.697H2.25z" />
                      </svg>
                    </div>
                    <span className="font-bold text-gray-800 flex-1">Cash on Delivery</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'cod' ? 'border-brand' : 'border-gray-300'}`}>
                       {selectedMethod === 'cod' && <div className="w-2.5 h-2.5 bg-brand rounded-full"></div>}
                    </div>
               </div>
            </div>
         </div>

         <div className="sticky bottom-0 bg-white p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] border-t border-gray-100 mt-auto z-20">
           <button
             className="w-full bg-brand text-white font-bold py-3.5 rounded-xl text-lg flex justify-center items-center gap-2 active:scale-[0.98] transition-transform"
             onClick={() => {
                setCheckoutState('processing');
                setTimeout(() => setCheckoutState('success'), 2000);
             }}
           >
             <span>Pay Securely</span>
             <span>•</span>
             <span>₹{finalAmount}</span>
           </button>
         </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 h-full bg-white">
        <div className="w-48 h-48 mb-6 opacity-80 shadow-inner rounded-full overflow-hidden">
          <img src="https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=300&q=80" alt="Empty Cart" className="w-full h-full object-cover grayscale opacity-80" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center text-sm">Looks like you haven't added any groceries yet</p>
        <button 
          onClick={() => onNavigate('home')}
          className="bg-brand text-white font-bold py-3 px-8 rounded-xl shadow-md active:scale-95 transition-transform"
        >
          Browse Shops
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-4 relative">
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-3">
        <button onClick={() => onNavigate('home')} className="p-1 active:bg-gray-100 rounded-full">
          <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="font-bold text-lg text-gray-900">Checkout</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white p-4 mb-3 border-b border-gray-100 flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
             <img src={getStoreThumbnail(storeId)} alt={storeName} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">{storeName}</h2>
            <p className="text-gray-500 text-xs">Delivery in 10-15 mins</p>
          </div>
        </div>

        <div className="bg-white p-4 mb-3 border-y border-gray-100">
          <div className="space-y-4">
            {cart.map((cartItem) => (
              <div key={cartItem.product.id} className="flex justify-between items-center py-1">
                <div className="flex flex-col flex-1 pr-2">
                  <span className="text-gray-800 font-medium text-sm leading-tight">{cartItem.product.name}</span>
                  <span className="text-gray-400 text-[10px] mt-0.5">{cartItem.product.weight}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-between border border-green-200 bg-green-50 rounded-lg w-20 px-2 py-1">
                    <button onClick={() => onRemove(cartItem.product.id)} className="text-green-600 font-bold px-1 text-lg leading-none">-</button>
                    <span className="text-green-600 font-bold text-sm">{cartItem.quantity}</span>
                    <button onClick={() => onAdd(cartItem.product, cartItem.storeId, cartItem.storeName)} className="text-green-600 font-bold px-1 text-lg leading-none">+</button>
                  </div>
                  <span className="text-gray-800 font-medium w-12 text-right text-sm">
                    ₹{(cartItem.product.price * cartItem.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 border-y border-gray-100 mb-6">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">Bill Details</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Item Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Charges</span>
              <span>₹{taxes.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100 font-bold text-gray-900">
            <span>To Pay</span>
            <span>₹{finalAmount}</span>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] border-t border-gray-100 mt-auto z-20">
        <button 
          className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl text-lg flex justify-between items-center px-6 active:scale-[0.98] transition-transform"
          onClick={() => setCheckoutState('address')}
        >
          <span>₹{finalAmount}</span>
          <span>Proceed to Checkout</span>
        </button>
      </div>
    </div>
  );
};

export default Cart;