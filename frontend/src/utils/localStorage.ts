// User storage
export const saveUserToStorage = (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  export const getUserFromStorage = () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  };
  
  export const removeUserFromStorage = () => {
    localStorage.removeItem('user');
  };
  
  // Cart storage
  export const saveCartToStorage = (cartItems: any[]) => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  };
  
  export const getCartFromStorage = () => {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
  };
  
  // Shipping address storage
  export const saveShippingAddressToStorage = (shippingAddress: any) => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  };
  
  export const getShippingAddressFromStorage = () => {
    const shippingAddress = localStorage.getItem('shippingAddress');
    return shippingAddress ? JSON.parse(shippingAddress) : {};
  };
  
  // Payment method storage
  export const savePaymentMethodToStorage = (paymentMethod: string) => {
    localStorage.setItem('paymentMethod', paymentMethod);
  };
  
  export const getPaymentMethodFromStorage = () => {
    return localStorage.getItem('paymentMethod') || '';
  };
  
  // Payment currency storage
  export const savePaymentCurrencyToStorage = (paymentCurrency: string) => {
    localStorage.setItem('paymentCurrency', paymentCurrency);
  };
  
  export const getPaymentCurrencyFromStorage = () => {
    return localStorage.getItem('paymentCurrency') || 'USD';
  };