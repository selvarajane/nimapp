import React, { useState } from 'react';
import { ViewState } from '../types';
import { ArrowLeftIcon } from './Icons';

interface ProfileProps {
  onNavigate: (view: ViewState) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Default user state (simulating fetched data)
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567'
  });

  // Temporary state for editing
  const [editData, setEditData] = useState({ ...user });

  const handleSave = () => {
    setUser({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...user });
    setIsEditing(false);
  };

  const handleChange = (field: keyof typeof user, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-4 relative">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-3">
        <button onClick={() => onNavigate('home')} className="p-1 active:bg-gray-100 rounded-full transition-colors">
          <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="font-bold text-lg text-gray-900">My Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
        {/* Avatar Section */}
        <div className="w-24 h-24 mt-6 mb-4 relative">
          <img 
            src="https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&w=200&q=80" 
            alt="Profile" 
            className="w-full h-full object-cover rounded-full shadow-md border-4 border-white"
          />
          {isEditing && (
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center shadow-sm border-2 border-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M2.695 14.763l-1.262 3.152a.5.5 0 00.65.65l3.152-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
              </svg>
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-extrabold text-gray-900 mb-8">{user.name}</h2>

        {/* Details Card */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-2 border-b border-gray-50 pb-2">Personal Information</h3>
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Full Name</label>
            {isEditing ? (
              <input 
                type="text" 
                value={editData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-shadow"
              />
            ) : (
              <div className="text-sm font-semibold text-gray-900">{user.name}</div>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Email Address</label>
            {isEditing ? (
              <input 
                type="email" 
                value={editData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-shadow"
              />
            ) : (
              <div className="text-sm font-semibold text-gray-900">{user.email}</div>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Phone Number</label>
            {isEditing ? (
              <input 
                type="tel" 
                value={editData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-shadow"
              />
            ) : (
              <div className="text-sm font-semibold text-gray-900">{user.phone}</div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Area */}
      <div className="sticky bottom-0 bg-white p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] border-t border-gray-100 mt-auto z-20">
        {isEditing ? (
          <div className="flex gap-3">
            <button 
              onClick={handleCancel}
              className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl text-sm active:scale-[0.98] transition-all hover:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={!editData.name.trim() || !editData.email.trim() || !editData.phone.trim()}
              className="flex-[2] bg-brand text-white font-bold py-3.5 rounded-xl text-sm shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="w-full bg-brand text-white font-bold py-3.5 rounded-xl text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;