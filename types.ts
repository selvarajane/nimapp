export interface Store {
  id: string;
  name: string;
  categories: string[];
  rating: number;
  deliveryTime: string;
  minOrder: string;
  offer: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: string;
  isOrganic: boolean;
}

export interface InventoryCategory {
  category: string;
  items: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  storeId: string;
  storeName: string;
}

export type ViewState = 'home' | 'store' | 'cart' | 'ai' | 'tracking' | 'profile';

export interface Restaurant {
  id: string;
  name: string;
  cuisines: string[];
  rating: number;
  deliveryTime: string;
  costForTwo: string;
  offer: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  isVeg: boolean;
}