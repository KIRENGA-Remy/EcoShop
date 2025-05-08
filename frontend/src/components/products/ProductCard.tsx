import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    countInStock: number;
    description: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (product.countInStock > 0) {
      addToCart({
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        quantity: 1,
      });
      toast.success(`${product.name} added to cart`);
    }
  };

  return (
    <div className="card group">
      <Link to={`/product/${product.id}`} className="block overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">${Number(product.price).toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className={`btn p-2 rounded-full ${
              product.countInStock === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
        {product.countInStock === 0 && (
          <p className="text-rose-600 text-sm mt-2">Out of stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;