import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { MapPin, Plus, Edit, Trash2, Home, Briefcase, Building, Star, X, Map, Loader2 } from 'lucide-react';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [locating, setLocating] = useState(false);
  
  const initialFormState = {
    fullName: '',
    phone: '',
    house: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    type: 'Home',
    isDefault: false
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      setAddresses(res.data.data);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'Home': return <Home className="w-5 h-5" />;
      case 'Office': return <Briefcase className="w-5 h-5" />;
      case 'College': return <Building className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const openModal = (address = null) => {
    if (address) {
      setIsEditing(true);
      setEditId(address._id);
      setFormData(address);
    } else {
      setIsEditing(false);
      setEditId(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/addresses/${editId}`, formData);
      } else {
        await api.post('/addresses', formData);
      }
      fetchAddresses();
      closeModal();
      toast.success(isEditing ? 'Address updated!' : 'Address added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving address');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await api.delete(`/addresses/${id}`);
        toast.info('Address removed');
        fetchAddresses();
      } catch (err) {
        toast.error('Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.put(`/addresses/${id}`, { isDefault: true });
      toast.success('Default address updated');
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to set default address');
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use OpenStreetMap Nominatim API for reverse geocoding (Free, no API key required)
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
          const data = await response.json();
          
          if (data && data.address) {
            setFormData(prev => ({
              ...prev,
              street: data.address.road || data.address.pedestrian || '',
              area: data.address.suburb || data.address.neighbourhood || data.address.residential || '',
              city: data.address.city || data.address.town || data.address.county || '',
              state: data.address.state || '',
              pincode: data.address.postcode || ''
            }));
            toast.success('Address auto-filled from current location!');
          }
        } catch (error) {
          console.error("Error fetching location data", error);
          toast.error('Could not fetch address details for your location');
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.error(error);
        toast.warning('Unable to retrieve your location. Check browser permissions.');
        setLocating(false);
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          <button 
            onClick={() => openModal()}
            className="bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-5 rounded-xl flex items-center gap-2 transition shadow-sm"
          >
            <Plus className="w-5 h-5" /> Add New Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No addresses found</h2>
            <p className="text-gray-500 mb-6">You haven't saved any delivery addresses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map(addr => (
              <div key={addr._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group">
                {addr.isDefault && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 shadow-sm z-10">
                    <Star className="w-3 h-3 fill-white" /> Default
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                    {getAddressIcon(addr.type)}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{addr.type}</h3>
                </div>
                
                <div className="space-y-1 mb-6 text-gray-600">
                  <p className="font-medium text-gray-900">{addr.fullName}</p>
                  <p>{addr.house}, {addr.street}</p>
                  <p>{addr.area}</p>
                  <p>{addr.city}, {addr.state} {addr.pincode}</p>
                  <p className="pt-2 font-medium">Phone: {addr.phone}</p>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                  {!addr.isDefault ? (
                    <button 
                      onClick={() => handleSetDefault(addr._id)}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">Default Address</span>
                  )}
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openModal(addr)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(addr._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Address Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Address' : 'Add New Address'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locating}
                className="w-full mb-6 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition"
              >
                {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Map className="w-5 h-5" />}
                {locating ? 'Detecting Location...' : 'Use Current Location'}
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Flat / House No. / Building</label>
                <input type="text" name="house" required value={formData.house} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street / Landmark</label>
                <input type="text" name="street" required value={formData.street} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Area / Sector / Village</label>
                <input type="text" name="area" required value={formData.area} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" name="state" required value={formData.state} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input type="text" name="pincode" required value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                <div className="flex gap-4">
                  {['Home', 'Office', 'College', 'Other'].map(type => (
                    <label key={type} className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="type" 
                        value={type}
                        checked={formData.type === type}
                        onChange={handleInputChange}
                        className="form-radio text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {!isEditing && (
                <div className="mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                      className="form-checkbox text-primary rounded focus:ring-primary h-4 w-4"
                    />
                    <span className="ml-2 text-sm text-gray-700 font-medium">Make this my default address</span>
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-primary text-white font-medium hover:bg-primary-dark rounded-lg transition shadow-sm">
                  {isEditing ? 'Save Changes' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;
