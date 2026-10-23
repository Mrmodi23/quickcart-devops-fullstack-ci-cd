import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (searchKeyword = '') => {
    setLoading(true);
    try {
      const url = searchKeyword ? `/products?keyword=${searchKeyword}` : '/products';
      const res = await api.get(url);
      setProducts(res.data.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(keyword);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation button */}
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary mb-6 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition duration-200" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
          <Link to="/admin/products/new" className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition">
            <Plus className="w-5 h-5" /> Add Product
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <form onSubmit={handleSearch} className="relative max-w-md">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <button type="submit" className="hidden">Search</button>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 text-sm text-left">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 p-1 flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                          </div>
                          <div className="font-medium text-gray-900 max-w-[200px] truncate">{product.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 font-medium">₹{product.price}</div>
                        {product.discountPrice > 0 && (
                          <div className="text-xs text-green-600">Sale: ₹{product.discountPrice}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${product.stock <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
                          {product.stock} {product.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/products/${product._id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
