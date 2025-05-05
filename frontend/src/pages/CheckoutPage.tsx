import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { MapPin } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { shippingAddress, saveShippingAddress } = useCartStore();
  
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    saveShippingAddress({
      address,
      city,
      postalCode,
      country
    });
    
    navigate('/payment');
  };

  return (
    <div className="max-w-md mx-auto page-transition">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-gray-600 mb-6">Step 1: Shipping Address</p>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Street Address
            </label>
            <input
              type="text"
              id="address"
              className="form-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              type="text"
              id="city"
              className="form-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="postalCode" className="form-label">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              className="form-input"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="country" className="form-label">
              Country
            </label>
            <input
              type="text"
              id="country"
              className="form-input"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full py-3 flex items-center justify-center"
          >
            <MapPin className="h-5 w-5 mr-2" />
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;