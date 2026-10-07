import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Clock, TrendingUp, ShieldCheck } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products')
        ]);
        setCategories(catRes.data.data.slice(0, 8));
        setProducts(prodRes.data.data.slice(0, 8)); // Just get a few for the home page
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Groceries delivered in <span className="text-yellow-300">10-20 minutes</span>
            </h1>
            <p className="text-lg text-green-100 mb-8">
              Fresh produce, daily essentials, and more delivered straight to your door.
            </p>
            <Link to="/products" className="bg-white text-primary font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300">
              Shop Now
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            {/* Placeholder for hero image */}
            <div className="w-64 h-64 bg-green-500 rounded-full flex items-center justify-center border-8 border-white/20 shadow-2xl relative">
              <span className="text-6xl text-white">🛒</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="bg-green-100 p-3 rounded-full text-primary">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Superfast Delivery</h3>
                <p className="text-sm text-gray-500">Order received in minutes</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Best Quality</h3>
                <p className="text-sm text-gray-500">Fresh and quality checked</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Great Offers</h3>
                <p className="text-sm text-gray-500">Discounts on top brands</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link key={category._id} to={`/products?category=${category._id}`} className="flex flex-col items-center group">
              <div className="w-full aspect-square bg-white rounded-xl shadow-sm overflow-hidden mb-2 group-hover:shadow-md transition border border-gray-100">
                <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              </div>
              <span className="text-sm font-medium text-center text-gray-700 group-hover:text-primary">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Products */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Bestsellers</h2>
            <Link to="/products" className="text-primary hover:text-primary-dark font-medium">View All &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition flex flex-col h-full">
                <Link to={`/products/${product._id}`} className="block relative pt-[100%] bg-gray-50">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-contain p-4 mix-blend-multiply dark:mix-blend-normal"
                  />
                  {product.discountPrice > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </span>
                  )}
                </Link>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="text-xs text-gray-500 mb-1">{product.quantity} {product.unit}</div>
                  <Link to={`/products/${product._id}`} className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-primary">
                    {product.name}
                  </Link>
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      {product.discountPrice > 0 ? (
                        <>
                          <span className="font-bold text-lg text-gray-900">₹{product.discountPrice}</span>
                          <span className="text-sm text-gray-400 line-through ml-1">₹{product.price}</span>
                        </>
                      ) : (
                        <span className="font-bold text-lg text-gray-900">₹{product.price}</span>
                      )}
                    </div>
                        <button 
                          onClick={async (e) => {
                            e.preventDefault();
                            const res = await addToCart(product._id, 1);
                            if (res.success) {
                              alert('Added to cart!');
                            }
                          }}
                          className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-md font-medium transition border border-primary/20"
                        >
                          Add
                        </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
