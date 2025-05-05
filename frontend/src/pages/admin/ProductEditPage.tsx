import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi } from '../../api';
import { ArrowLeft, Save } from 'lucide-react';
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';
import { toast } from 'react-toastify';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if(!id) return;
        const { data } = await productsApi.getById(id);
        
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load product');
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      setUpdateLoading(true);
      if(!id ) return;
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price.toString());
      formData.append('image', image);
      formData.append('category', category);
      formData.append('countInStock', countInStock.toString());
      formData.append('description', description);
      await productsApi.update(id, formData);
      
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (err) {
      let errorMessage = 'Failed to update product';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
      setUpdateLoading(false);
    }
  };

  return (
    <div className="page-transition">
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Back to products
      </button>

      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="countInStock" className="form-label">
                  Count In Stock
                </label>
                <input
                  type="number"
                  id="countInStock"
                  className="form-input"
                  value={countInStock}
                  onChange={(e) => setCountInStock(Number(e.target.value))}
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home & Kitchen</option>
                <option value="beauty">Beauty & Personal Care</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="image" className="form-label">
                Image URL
              </label>
              <input
                type="text"
                id="image"
                className="form-input"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </div>
            
            {image && (
              <div className="mb-4">
                <label className="form-label">Image Preview</label>
                <div className="mt-1 border rounded-md overflow-hidden h-40 w-40">
                  <img
                    src={image}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full py-3 flex items-center justify-center"
              disabled={updateLoading}
            >
              {updateLoading ? (
                <Loader />
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Update Product
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductEditPage;