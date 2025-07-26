
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Leaf, Users, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '@/components/ui/animated-background';
import InteractiveButton from '@/components/ui/interactive-button';
import GradientCard from '@/components/ui/gradient-card';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'buyer' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setIsLoading(true);
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      console.log('Signup attempt:', { ...formData, role: selectedRole });
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const roles = [
    {
      id: 'farmer' as const,
      title: 'I am a Farmer',
      description: 'Sell your agricultural products directly to buyers',
      icon: Leaf,
      gradient: 'from-crop-green/10 to-crop-field/5',
      borderColor: 'border-crop-green/30'
    },
    {
      id: 'buyer' as const,
      title: 'I am a Buyer',
      description: 'Purchase fresh produce directly from farmers',
      icon: ShoppingCart,
      gradient: 'from-harvest-yellow/10 to-harvest-sunshine/5',
      borderColor: 'border-harvest-yellow/30'
    }
  ];

  return (
    <AnimatedBackground variant="waves" className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8 text-center">
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-crop-green to-crop-field rounded-2xl">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-crop-green to-harvest-yellow bg-clip-text text-transparent">
                AgriLink Direct
              </h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Join the Agricultural Revolution
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Connect with a thriving community of farmers and buyers. Start your journey towards sustainable and profitable agriculture today.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-crop-green/10 p-6 rounded-xl text-center">
              <Users className="h-8 w-8 text-crop-green mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">2,500+</p>
              <p className="text-sm text-muted-foreground">Active Farmers</p>
            </div>
            <div className="bg-harvest-yellow/10 p-6 rounded-xl text-center">
              <ShoppingCart className="h-8 w-8 text-harvest-yellow mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">8,750+</p>
              <p className="text-sm text-muted-foreground">Products Listed</p>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full max-w-md mx-auto">
          <GradientCard gradient="from-white via-white to-harvest-yellow/5" className="shadow-2xl">
            <CardHeader className="space-y-4 text-center pb-6">
              <CardTitle className="text-2xl font-bold text-foreground">
                Create Your Account
              </CardTitle>
              <p className="text-muted-foreground">
                Join thousands of successful farmers and buyers
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">I want to join as:</Label>
                <div className="grid grid-cols-1 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={`p-4 border-2 rounded-xl transition-all duration-300 text-left ${
                          selectedRole === role.id
                            ? `${role.borderColor} bg-gradient-to-r ${role.gradient} shadow-lg scale-105`
                            : 'border-border/20 hover:border-border/40'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${selectedRole === role.id ? 'bg-white/70' : 'bg-muted/50'}`}>
                            <Icon className="h-5 w-5 text-crop-green" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{role.title}</p>
                            <p className="text-xs text-muted-foreground">{role.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="pl-10 h-11 border-2 border-border/20 focus:border-crop-green transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10 h-11 border-2 border-border/20 focus:border-crop-green transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10 h-11 border-2 border-border/20 focus:border-crop-green transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10 h-11 border-2 border-border/20 focus:border-crop-green transition-all duration-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-10 pr-10 h-11 border-2 border-border/20 focus:border-crop-green transition-all duration-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <InteractiveButton
                  type="submit"
                  disabled={isLoading || !selectedRole}
                  className="w-full h-11 bg-gradient-to-r from-crop-green to-crop-field hover:from-crop-field hover:to-crop-green text-white"
                  glow
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Create Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </InteractiveButton>
              </form>

              <div className="space-y-4">
                <Separator />
                
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-crop-green hover:text-crop-field font-medium transition-colors">
                      Sign in here
                    </Link>
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    By creating an account, you agree to our{' '}
                    <Link to="/terms" className="text-crop-green hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-crop-green hover:underline">Privacy Policy</Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </GradientCard>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Signup;
