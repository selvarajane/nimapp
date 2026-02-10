import React, { useState } from 'react';
import { UserIcon } from './Icons';

interface HeaderProps {
  location: string;
  onLocationChange: (newLocation: string) => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ location, onLocationChange, onProfileClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempLocation, setTempLocation] = useState(location);

  const handleSave = () => {
    setIsEditing(false);
    if (tempLocation.trim() && tempLocation.trim() !== location) {
      onLocationChange(tempLocation.trim());
    } else {
      setTempLocation(location);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTempLocation(location);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-30 border-b border-gray-100 px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div 
            className="flex items-center gap-1 cursor-pointer w-max" 
            onClick={() => setIsEditing(true)}
            title="Click to change location"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-brand">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-gray-900 text-lg">Home</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
          
          <div className="ml-6 min-h-[16px] mt-0.5">
            {isEditing ? (
              <input
                autoFocus
                type="text"
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="text-xs text-gray-900 font-medium border-b border-brand outline-none w-48 bg-transparent"
                placeholder="Enter city or area..."
              />
            ) : (
              <span 
                className="text-xs text-gray-500 truncate w-48 block cursor-pointer hover:text-brand transition-colors"
                onClick={() => setIsEditing(true)}
                title="Click to change location"
              >
                {location}
              </span>
            )}
          </div>
        </div>
        <div 
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer active:scale-95 transition-transform hover:bg-gray-200"
        >
          <UserIcon className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </header>
  );
};

export default Header;