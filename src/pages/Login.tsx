
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '@/components/ui/animated-background';
import InteractiveButton from '@/components/ui/interactive-button';
import GradientCard from '@/components/ui/gradient-card';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login attempt:', formData);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatedBackground variant="particles" className="min-h-screen flex items-center justify-center p-4">
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
                Welcome Back to the Future of Agriculture
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Continue your journey in connecting farmers and buyers through our innovative marketplace platform.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop" 
              alt="Agricultural landscape"
              className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-crop-green/20 to-transparent rounded-2xl" />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <GradientCard gradient="from-white via-white to-crop-green/5" className="shadow-2xl">
            <CardHeader className="space-y-4 text-center pb-6">
              <CardTitle className="text-2xl font-bold text-foreground">
                Sign In to Your Account
              </CardTitle>
              <p className="text-muted-foreground">
                Enter your credentials to access your dashboard
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="farmer@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10 h-12 border-2 border-border/20 focus:border-crop-green transition-all duration-300"
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
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10 h-12 border-2 border-border/20 focus:border-crop-green transition-all duration-300"
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
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-crop-green hover:text-crop-field transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <InteractiveButton
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-crop-green to-crop-field hover:from-crop-field hover:to-crop-green text-white text-lg"
                  glow
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </InteractiveButton>
              </form>

              <div className="space-y-4">
                <Separator className="my-6" />
                
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-crop-green hover:text-crop-field font-medium transition-colors">
                      Create one now
                    </Link>
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    By signing in, you agree to our{' '}
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

export default Login;
