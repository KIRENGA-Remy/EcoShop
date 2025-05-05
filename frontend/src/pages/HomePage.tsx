import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productsApi } from '../api';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';
import Pagination from '../components/products/Pagination';

interface Product{
    id: string;
    name: string;
    image: string;
    price: number;
    countInStock: number;
    description: string;
}
const HomePage = () => {
  const { keyword, pageNumber } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(Number(pageNumber) || 1);
  const [pages, setPages] = useState(1);
  const [category, setCategory] = useState('');

  const categories = [
    { id: '', name: 'All Categories' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'home', name: 'Home & Kitchen' },
    { id: 'beauty', name: 'Beauty & Personal Care' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await productsApi.getAll(
          keyword || '',
          Number(pageNumber) || 1,
          category
        );
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, pageNumber, category]);

  return (
    <div className="page-transition">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Latest Products</h1>
          {keyword && (
            <p className="text-gray-600">Search results for: <span className="font-semibold">{keyword}</span></p>
          )}
        </div>
        
        <div className="mt-4 md:mt-0">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : products.length === 0 ? (
        <Message>No products found</Message>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination pages={pages} page={page} keyword={keyword} />
        </>
      )}
    </div>
  );
};

export default HomePage;