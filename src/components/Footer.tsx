
import React from 'react';
import { Sprout, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram, Home, Info, Contact } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#', icon: Home },
    { name: 'About Us', href: '#about', icon: Info },
    { name: 'Contact', href: '#contact', icon: Contact },
  ];

  const services = [
    { name: 'Product Upload', href: '#' },
    { name: 'Bulk Ordering', href: '#' },
    { name: 'Quality Checking', href: '#' },
    { name: 'Payment System', href: '#' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-sky-500' },
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-700' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#F5F5DC] via-green-50/30 to-yellow-50/20 text-gray-800 font-sans">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6 group cursor-pointer">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                <Sprout className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">AgriConnect</h3>
                <p className="text-green-600 text-sm font-medium">Farm to Market Direct</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              India's most trusted agricultural marketplace connecting farmers 
              directly with bulk buyers for better prices and quality assurance.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-11 h-11 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-white ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-800">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="flex items-center space-x-3 text-gray-600 hover:text-green-600 transition-all duration-300 group hover:translate-x-1"
                    >
                      <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      <span className="relative">
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-800">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.href}
                    className="text-gray-600 hover:text-green-600 transition-all duration-300 group hover:translate-x-1 block relative"
                  >
                    <span className="relative">
                      {service.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-800">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <Mail className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <p className="text-gray-600 hover:text-green-600 transition-colors duration-300 cursor-pointer">support@agriconnect.in</p>
                  <p className="text-gray-600 hover:text-green-600 transition-colors duration-300 cursor-pointer">farmers@agriconnect.in</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <Phone className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <p className="text-gray-600 hover:text-green-600 transition-colors duration-300 cursor-pointer">+91 98765 43210</p>
                  <p className="text-gray-600 hover:text-green-600 transition-colors duration-300 cursor-pointer">+91 98765 43211</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <p className="text-gray-600 leading-relaxed">
                    AgriConnect Hub<br />
                    Sector 18, Gurgaon<br />
                    Haryana 122015, India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} AgriConnect. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors duration-300 relative group">
                Privacy Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors duration-300 relative group">
                Terms of Service
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors duration-300 relative group">
                Cookie Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
