import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, Settings, LogOut, MapPin } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-primary/5 p-8 border-b border-primary/10 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-md">
              {user.name.charAt(0)}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary font-medium rounded-full text-sm mt-2 capitalize">
                {user.role}
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-gray-50 p-3 rounded-lg text-gray-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-50 p-3 rounded-lg text-gray-500">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-50 p-3 rounded-lg text-gray-500">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/addresses" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-primary transition group text-left">
            <div className="bg-gray-50 p-4 rounded-xl text-gray-500 group-hover:bg-primary group-hover:text-white transition">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Manage Addresses</h3>
              <p className="text-sm text-gray-500">Add or edit delivery addresses</p>
            </div>
          </Link>
          
          <button className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-primary transition group text-left">
            <div className="bg-gray-50 p-4 rounded-xl text-gray-500 group-hover:bg-primary group-hover:text-white transition">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Account Settings</h3>
              <p className="text-sm text-gray-500">Change password and details</p>
            </div>
          </button>
        </div>

        <div className="mt-8">
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-red-600 font-medium hover:underline bg-red-50 px-4 py-3 rounded-xl w-full justify-center"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
