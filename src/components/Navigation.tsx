
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleAuthAction = (action: 'login' | 'signup') => {
    navigate('/auth');
  };

  const handleLogout = async () => {
    await signOut();
    onSectionChange('home');
  };

  const handleDashboard = () => {
    if (profile) {
      switch (profile.role) {
        case 'farmer':
          navigate('/farmer-dashboard');
          break;
        case 'buyer':
          navigate('/buyer-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
      }
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Modern Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onSectionChange('home')}>
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">AgriConnect</h1>
              <p className="text-green-600 text-sm font-medium">Farm to Market Direct</p>
            </div>
          </div>

          {/* Modern Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`px-6 py-3 font-medium text-sm rounded-xl transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'bg-green-100 text-green-700 shadow-sm' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Modern Auth Buttons */}
          <div className="hidden md:flex space-x-3">
            {user && profile ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleDashboard}
                  className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 font-medium rounded-xl px-6"
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center space-x-2 font-medium rounded-xl px-6"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleAuthAction('login')}
                  className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 font-medium rounded-xl px-6"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => handleAuthAction('signup')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-green-500/25 font-medium rounded-xl px-6 transform hover:scale-105 transition-all duration-300"
                >
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Modern Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
          </button>
        </div>

        {/* Modern Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 bg-white/95 backdrop-blur-lg rounded-b-2xl shadow-lg">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3 font-medium rounded-xl transition-all duration-200 ${
                    activeSection === item.id 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                {user && profile ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleDashboard();
                        setMobileMenuOpen(false);
                      }}
                      className="border-green-200 text-green-700 rounded-xl"
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="border-red-200 text-red-600 rounded-xl"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleAuthAction('login');
                        setMobileMenuOpen(false);
                      }}
                      className="border-green-200 text-green-700 rounded-xl"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        handleAuthAction('signup');
                        setMobileMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl"
                    >
                      Register
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
