import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi } from '../api';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, ArrowLeft, Star, StarHalf } from 'lucide-react';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';
import { toast } from 'react-toastify';

interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    image: string;
    category: string;
    countInStock: number;
    rating?: number;
    numReviews?: number;
    createdAt?: string;
    updatedAt?: string;
  }

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
        if(!id) return;
      try {
        setLoading(true);
        const { data } = await productsApi.getById(id);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details');
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.countInStock > 0) {
      addToCart({
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        quantity,
      });
      toast.success(`${product.name} added to cart`);
      navigate('/cart');
    }
  };

  return (
    <div className="page-transition">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Back to products
      </button>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : !product ? (
        <Message variant="error">Product not found</Message>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-contain max-h-[500px]"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex text-amber-400 mr-2">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <StarHalf className="h-5 w-5 fill-current" />
              </div>
              <span className="text-gray-600">128 reviews</span>
            </div>
            
            <div className="text-2xl font-bold mb-4">
              ${Number(product.price).toFixed(2)}
            </div>
            
            <div className="border-t border-b py-4 my-4">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Status:</span>
                <span className={product.countInStock > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              {product.countInStock > 0 && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Quantity:</span>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="form-input w-24"
                  >
                    {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className={`btn w-full py-3 flex items-center justify-center ${
                product.countInStock === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;