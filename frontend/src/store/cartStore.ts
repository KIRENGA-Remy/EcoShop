import { create } from 'zustand';
import { 
  saveCartToStorage,
  getCartFromStorage,
  saveShippingAddressToStorage,
  getShippingAddressFromStorage,
  savePaymentMethodToStorage,
  getPaymentMethodFromStorage,
  savePaymentCurrencyToStorage,
  getPaymentCurrencyFromStorage
} from '../utils/localStorage';

interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  quantity: number;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CartState {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentCurrency: string;
  
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  saveShippingAddress: (address: ShippingAddress) => void;
  savePaymentMethod: (method: string) => void;
  savePaymentCurrency: (currency: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItems: getCartFromStorage(),
  shippingAddress: getShippingAddressFromStorage(),
  paymentMethod: getPaymentMethodFromStorage(),
  paymentCurrency: getPaymentCurrencyFromStorage(),
  
  addToCart: (item: CartItem) => {
    set((state) => {
      // Check if item already exists in cart
      const existItem = state.cartItems.find(
        (x) => x.productId === item.productId
      );

      let updatedCartItems;

      if (existItem) {
        // Update quantity if item exists
        updatedCartItems = state.cartItems.map((x) =>
          x.productId === existItem.productId ? item : x
        );
      } else {
        // Add new item
        updatedCartItems = [...state.cartItems, item];
      }

      saveCartToStorage(updatedCartItems);
      return { cartItems: updatedCartItems };
    });
  },
  
  removeFromCart: (id: string) => {
    set((state) => {
      const updatedCartItems = state.cartItems.filter(
        (item) => item.productId !== id
      );
      saveCartToStorage(updatedCartItems);
      return { cartItems: updatedCartItems };
    });
  },
  
  updateQuantity: (id: string, quantity: number) => {
    set((state) => {
      const updatedCartItems = state.cartItems.map((item) =>
        item.productId === id ? { ...item, quantity } : item
      );
      saveCartToStorage(updatedCartItems);
      return { cartItems: updatedCartItems };
    });
  },
  
  clearCart: () => {
    saveCartToStorage([]);
    set({ cartItems: [] });
  },
  
  saveShippingAddress: (address: ShippingAddress) => {
    saveShippingAddressToStorage(address);
    set({ shippingAddress: address });
  },
  
  savePaymentMethod: (method: string) => {
    savePaymentMethodToStorage(method);
    set({ paymentMethod: method });
  },
  
  savePaymentCurrency: (currency: string) => {
    savePaymentCurrencyToStorage(currency);
    set({ paymentCurrency: currency });
  },
}));