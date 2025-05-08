import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsApi } from '../../api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';
import { toast } from 'react-toastify';
import { imageToBase64 } from '../../utility/ImageToBase64';

interface Product {
    id: string;
    image: string;
    name: string;
    countInStock: number;
    price: number;
    category: string;
    description: string;
}

const ProductsPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await productsApi.getAll();
      // Ensure price is converted to number
      const processedProducts = data.products.map((product: any) => ({
        ...product,
        price: Number(product.price) || 0
      }));
      setProducts(processedProducts);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCreateLoading(true);
      
      const name = prompt('Enter product name:') || 'New Product';
      const price = prompt('Enter product price:') || '0';
      const category = prompt('Enter product category:') || 'Uncategorized';
      const countInStock = prompt('Enter stock count:') || '0';
      const description = prompt('Enter product description:') || '';

      // Convert image to base64
      const image = await imageToBase64(file);
      if (typeof image !== 'string') {
        throw new Error('Failed to convert image');
      }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', image); 
    formData.append('category', category);
    formData.append('countInStock', countInStock);
    formData.append('description', description);

      const { data } = await productsApi.create(formData);
      toast.success('Product created successfully');
      navigate(`/admin/product/${data.id}/edit`);
    } catch (err) {
      toast.error('Failed to create product');
      console.error(err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setDeleteLoading(true);
        await productsApi.delete(id);
        fetchProducts();
        toast.success('Product deleted');
      } catch (err) {
        toast.error('Failed to delete product');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  return (
    <div className="page-transition">
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      /> 
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={handleCreateClick}
          className="btn btn-primary flex items-center"
          disabled={createLoading}
        >
          {createLoading ? (
            <Loader />
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              Create Product
            </>
          )}
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-cell-header">ID</th>
                  <th className="table-cell-header">Image</th>
                  <th className="table-cell-header">Name</th>
                  <th className="table-cell-header">Price</th>
                  <th className="table-cell-header">Category</th>
                  <th className="table-cell-header">In Stock</th>
                  <th className="table-cell-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="table-row">
                    <td className="table-cell text-gray-500">
                      {product.id.substring(0, 8)}...
                    </td>
                    <td className="table-cell">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="table-cell font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="table-cell">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="table-cell">
                      {product.category}
                    </td>
                    <td className="table-cell">
                      <span className={product.countInStock > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {product.countInStock > 0 ? product.countInStock : 'Out of stock'}
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/product/${product.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-rose-600 hover:text-rose-900"
                          disabled={deleteLoading}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;