import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { ArrowLeftIcon } from './Icons';

interface TrackingProps {
  storeName: string;
  onNavigate: (view: ViewState) => void;
}

const Tracking: React.FC<TrackingProps> = ({ storeName, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [eta, setEta] = useState(15);

  useEffect(() => {
    // Simulate order progress
    const timer1 = setTimeout(() => {
      setCurrentStep(2);
      setEta(12);
    }, 4000);

    const timer2 = setTimeout(() => {
      setCurrentStep(3);
      setEta(5);
    }, 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const steps = [
    { title: 'Order Confirmed', description: 'Your order has been received.', time: '10:00 AM' },
    { title: 'Packing your items', description: `${storeName || 'The store'} is preparing your order.`, time: '10:03 AM' },
    { title: 'On the way', description: 'Delivery partner is heading to you.', time: '10:10 AM' }
  ];

  return (
    <div className="flex flex-col min-h-full bg-white relative">
      {/* Map Section */}
      <div className="relative w-full h-64 bg-gray-200 flex-shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" 
          alt="Map" 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white"></div>
        
        {/* Top bar over map */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center z-10">
          <button 
            onClick={() => onNavigate('home')} 
            className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-800" />
          </button>
        </div>

        {/* Floating Eta Card */}
        <div className="absolute bottom-6 left-4 right-4 bg-white rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.12)] p-4 flex items-center justify-between z-10">
          <div>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Estimated Arrival</p>
             <h2 className="text-3xl font-extrabold text-gray-900">{eta} <span className="text-xl">mins</span></h2>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center relative">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-600 relative z-10">
               <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
               <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.468c.85-.541 1.5-1.546 1.5-2.625V11.4c0-.682-.267-1.335-.742-1.81L18.45 6.333c-.4-.4-1.002-.583-1.56-.583h-1.14z" />
               <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
             </svg>
             {currentStep === 3 && (
               <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-50"></div>
             )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-8 pb-6 overflow-y-auto">
        {/* Delivery Partner Info */}
        {currentStep >= 2 && (
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 mb-8 border border-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&w=100&q=80" 
              alt="Driver" 
              className="w-12 h-12 rounded-full object-cover shadow-sm"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm">Alex Johnson</h3>
              <p className="text-gray-500 text-xs">Delivery Partner</p>
            </div>
            <a href="tel:+" className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center active:scale-95 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        )}

        {/* Progress Timeline */}
        <div className="pl-2">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > idx;
            const isActive = currentStep === idx + 1;
            
            return (
              <div key={idx} className="relative pl-8 pb-8 last:pb-0">
                {/* Line connector */}
                {idx !== steps.length - 1 && (
                  <div className={`absolute top-2 left-[5px] w-[2px] h-full ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                )}
                
                {/* Dot */}
                <div className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 bg-white ${isCompleted ? 'border-green-500 bg-green-500' : isActive ? 'border-green-500' : 'border-gray-300'}`}>
                   {isActive && (
                     <div className="absolute -inset-[5px] rounded-full border border-green-400 animate-ping"></div>
                   )}
                </div>

                {/* Content */}
                <div className={`flex flex-col -mt-1.5 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                   <div className="flex justify-between items-baseline mb-1">
                     <h4 className={`font-bold text-sm ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>{step.title}</h4>
                     <span className="text-xs text-gray-400 font-medium">{isCompleted ? step.time : ''}</span>
                   </div>
                   <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tracking;