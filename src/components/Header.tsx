
import React, { useState, useEffect } from 'react';
import { Sprout, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const Header = ({ activeSection = 'home', onSectionChange }: HeaderProps) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleNavClick = (sectionId: string) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleDashboardRedirect = () => {
    if (!profile) return;
    
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
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
          : 'bg-gradient-to-r from-[#F1F8E9] to-[#F5F5DC]'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleNavClick('home')}
            >
              <div className="p-2 bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] rounded-xl shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#212121] group-hover:text-[#4CAF50] transition-colors duration-300 font-heading">
                  AgriConnect
                </h1>
                <p className="text-[#4CAF50] text-sm font-medium">Farm to Market Direct</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative font-medium text-sm transition-all duration-300 group ${
                    activeSection === item.id 
                      ? 'text-[#4CAF50] font-semibold' 
                      : 'text-[#212121] hover:text-[#FBC02D] hover:scale-105'
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4CAF50] transition-all duration-300 group-hover:w-full ${
                    activeSection === item.id ? 'w-full' : ''
                  }`}></span>
                </button>
              ))}
            </nav>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              {user && profile ? (
                <>
                  <div className="flex items-center space-x-2 bg-[#4CAF50]/10 px-3 py-1 rounded-full border border-[#4CAF50]/20">
                    <User className="h-4 w-4 text-[#4CAF50]" />
                    <span className="capitalize font-medium text-[#4CAF50]">{profile.role}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleDashboardRedirect}
                    className="border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50]/10 hover:border-[#2E7D32] font-medium rounded-full px-6 transition-all duration-300"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center space-x-2 font-medium rounded-full px-6 transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleLogin}
                    className="border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50]/10 hover:border-[#2E7D32] font-medium rounded-full px-6 transition-all duration-300"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={handleLogin}
                    className="bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] hover:from-[#2E7D32] hover:to-[#1B5E20] text-white font-medium rounded-full px-6 shadow-lg hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-[#4CAF50]/10 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-[#212121]" />
              ) : (
                <Menu className="h-6 w-6 text-[#212121]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-20 left-4 right-4 bg-white rounded-2xl shadow-2xl p-6 border border-[#4CAF50]/10">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left p-3 rounded-xl font-medium transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'bg-[#4CAF50]/10 text-[#4CAF50] font-semibold' 
                      : 'text-[#212121] hover:text-[#4CAF50] hover:bg-[#4CAF50]/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-[#4CAF50]/10">
                {user && profile ? (
                  <>
                    <div className="flex items-center space-x-2 bg-[#4CAF50]/10 px-3 py-2 rounded-xl">
                      <User className="h-4 w-4 text-[#4CAF50]" />
                      <span className="capitalize font-medium text-[#4CAF50]">{profile.role}</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleDashboardRedirect();
                        setIsMobileMenuOpen(false);
                      }}
                      className="border-[#4CAF50] text-[#4CAF50] rounded-xl justify-start"
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="border-red-200 text-red-600 rounded-xl justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleLogin();
                        setIsMobileMenuOpen(false);
                      }}
                      className="border-[#4CAF50] text-[#4CAF50] rounded-xl justify-start"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        handleLogin();
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-white rounded-xl justify-start"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
