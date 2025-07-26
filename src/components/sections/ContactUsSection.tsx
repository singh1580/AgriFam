
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const ContactUsSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Address',
      details: ['AgriConnect Hub', 'Sector 18, Gurgaon', 'Haryana 122015, India'],
      color: 'text-[#4CAF50]',
      bg: 'bg-[#4CAF50]/10'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+91 98765 43210', '+91 98765 43211'],
      color: 'text-[#FBC02D]',
      bg: 'bg-[#FBC02D]/10'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['support@agriconnect.in', 'farmers@agriconnect.in'],
      color: 'text-[#29B6F6]',
      bg: 'bg-[#29B6F6]/10'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: ['Mon-Fri: 9:00 AM - 7:00 PM', 'Sat: 10:00 AM - 3:00 PM', 'Sun: Closed'],
      color: 'text-[#8D6E63]',
      bg: 'bg-[#8D6E63]/10'
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-600', bg: 'hover:bg-blue-50' },
    { icon: Twitter, href: '#', color: 'hover:text-sky-500', bg: 'hover:bg-sky-50' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-600', bg: 'hover:bg-pink-50' },
    { icon: Linkedin, href: '#', color: 'hover:text-blue-700', bg: 'hover:bg-blue-50' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5DC] via-[#F1F8E9] to-[#E8F5E8] py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-[#212121] mb-6 font-heading">
            Get in <span className="text-[#4CAF50]">Touch</span> with Us
          </h1>
          <p className="text-xl text-[#212121]/70 max-w-3xl mx-auto leading-relaxed">
            We're here to support farmers and buyers. Reach out anytime and let's grow together.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm border-0 shadow-xl animate-slide-up">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-[#212121] mb-8 font-heading">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-semibold text-[#212121] mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="h-12 border-2 border-[#4CAF50]/20 focus:border-[#4CAF50] focus:ring-[#4CAF50]/20 rounded-xl transition-all duration-300 hover:border-[#4CAF50]/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-semibold text-[#212121] mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="h-12 border-2 border-[#4CAF50]/20 focus:border-[#4CAF50] focus:ring-[#4CAF50]/20 rounded-xl transition-all duration-300 hover:border-[#4CAF50]/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-semibold text-[#212121] mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your requirements or questions..."
                      rows={6}
                      className="border-2 border-[#4CAF50]/20 focus:border-[#4CAF50] focus:ring-[#4CAF50]/20 rounded-xl transition-all duration-300 hover:border-[#4CAF50]/40 resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] hover:from-[#2E7D32] hover:to-[#1B5E20] text-white text-lg py-4 rounded-xl shadow-lg hover:shadow-green-500/25 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all duration-500 bg-white/90 backdrop-blur-sm border-0 shadow-lg animate-scale-in group cursor-pointer hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-14 h-14 ${info.bg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <info.icon className={`h-7 w-7 ${info.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#212121] mb-2 text-lg">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-[#212121]/70 leading-relaxed">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Social Media */}
            <Card className="hover:shadow-xl transition-all duration-500 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-[#212121] mb-4 text-lg">Follow Us</h3>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-12 h-12 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color} ${social.bg}`}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Google Map */}
            <Card className="hover:shadow-xl transition-all duration-500 bg-white/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-[#4CAF50]/20 to-[#2E7D32]/20 rounded-xl m-6 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-[#4CAF50] mx-auto mb-2" />
                    <p className="text-[#212121]/70 font-medium">Interactive Map</p>
                    <p className="text-sm text-[#212121]/50">Click to view location</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsSection;
