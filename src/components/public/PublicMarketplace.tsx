
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MapPin, Eye } from 'lucide-react';

const PublicMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  
  const products = [
    {
      id: 1,
      name: 'Premium Wheat (Gehun)',
      farmer: 'Rajesh Kumar',
      location: 'Punjab, India',
      category: 'Grain',
      quantity: '100 tons',
      price: '₹25,000/ton',
      quality: 'A',
      verified: true,
      image: 'photo-1574323347407-f5e1ad6d020b' // wheat field
    },
    {
      id: 2,
      name: 'Basmati Rice (Chawal)',
      farmer: 'Priya Sharma',
      location: 'Haryana, India',
      category: 'Grain',
      quantity: '75 tons',
      price: '₹45,000/ton',
      quality: 'A',
      verified: true,
      image: 'photo-1586201375761-83865001e31c' // rice grains
    },
    {
      id: 3,
      name: 'Yellow Corn (Makka)',
      farmer: 'Amit Singh',
      location: 'Uttar Pradesh, India',
      category: 'Grain',
      quantity: '120 tons',
      price: '₹20,000/ton',
      quality: 'A',
      verified: true,
      image: 'photo-1551754655-cd27e38d2076' // corn field
    },
    {
      id: 4,
      name: 'Moong Dal (Green Gram)',
      farmer: 'Sunita Devi',
      location: 'Rajasthan, India',
      category: 'Pulse',
      quantity: '30 tons',
      price: '₹80,000/ton',
      quality: 'A',
      verified: true,
      image: 'photo-1610440042657-612c34d95e9f' // green lentils
    },
    {
      id: 5,
      name: 'Chana Dal (Chickpea)',
      farmer: 'Ravi Patel',
      location: 'Gujarat, India',
      category: 'Pulse',
      quantity: '40 tons',
      price: '₹75,000/ton',
      quality: 'B',
      verified: true,
      image: 'photo-1623234672237-2b6b5f3b7c5e' // chickpeas
    },
    {
      id: 6,
      name: 'Organic Sugarcane',
      farmer: 'Lakshmi Reddy',
      location: 'Andhra Pradesh, India',
      category: 'Cash Crop',
      quantity: '200 tons',
      price: '₹3,500/ton',
      quality: 'A',
      verified: true,
      image: 'photo-1585441379707-4b1a0f8a95a2' // sugarcane
    },
    {
      id: 7,
      name: 'Turmeric (Haldi)',
      farmer: 'Gopal Reddy',
      location: 'Tamil Nadu, India',
      category: 'Spice',
      quantity: '15 tons',
      price: '₹120,000/ton',
      quality: 'A',
      verified: true,
      image: 'photo-1615485925450-0d299963fd5a' // turmeric
    },
    {
      id: 8,
      name: 'Red Chili (Lal Mirch)',
      farmer: 'Kamala Devi',
      location: 'Andhra Pradesh, India',
      category: 'Spice',
      quantity: '25 tons',
      price: '₹180,000/ton',
      quality: 'A',
      verified: true,
      image: 'photo-1583286746642-514943c156c1' // red chilies
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory;
    const matchesGrade = selectedGrade === 'all' || product.quality === selectedGrade;
    
    return matchesSearch && matchesCategory && matchesGrade;
  });

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Quality Produce Marketplace</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore premium agricultural products directly from verified farmers. 
            All products are quality-graded and ready for bulk orders.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products or farmers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="grain">Grain</SelectItem>
                  <SelectItem value="pulse">Pulse</SelectItem>
                  <SelectItem value="spice">Spice</SelectItem>
                  <SelectItem value="cash crop">Cash Crop</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Quality Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="A">Grade A</SelectItem>
                  <SelectItem value="B">Grade B</SelectItem>
                  <SelectItem value="C">Grade C</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-200">
                <img 
                  src={`https://images.unsplash.com/${product.image}?w=400&h=300&fit=crop`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  {product.verified && (
                    <Badge variant="default" className="bg-green-600 text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-1">by {product.farmer}</p>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <MapPin className="h-3 w-3 mr-1" />
                  {product.location}
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Grade {product.quality}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">{product.quantity}</span>
                  <span className="font-bold text-green-600">{product.price}</span>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-2">
                  Sign up to place bulk orders
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Join as Buyer to Place Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublicMarketplace;
