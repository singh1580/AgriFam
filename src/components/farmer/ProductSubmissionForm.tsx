import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateProduct } from '@/hooks/useProductMutations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductSubmissionFormProps {
  onClose: () => void;
}

const ProductSubmissionForm = ({ onClose }: ProductSubmissionFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const createProduct = useCreateProduct();
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity_available: '',
    quantity_unit: 'tons',
    price_per_unit: '',
    quality_grade: '',
    description: '',
    location: '',
    harvest_date: '',
    expiry_date: '',
    organic_certified: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit products",
        variant: "destructive"
      });
      return;
    }

    try {
      await createProduct.mutateAsync({
        ...formData,
        quantity_available: parseFloat(formData.quantity_available),
        price_per_unit: parseFloat(formData.price_per_unit),
        harvest_date: formData.harvest_date || null,
        expiry_date: formData.expiry_date || null,
      });
      
      onClose();
      toast({
        title: "Success",
        description: "Product submitted successfully for admin review",
      });
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="relative">
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5 text-crop-green" />
          <span>Submit New Product</span>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grain">Grain</SelectItem>
                  <SelectItem value="vegetable">Vegetable</SelectItem>
                  <SelectItem value="fruit">Fruit</SelectItem>
                  <SelectItem value="pulse">Pulse</SelectItem>
                  <SelectItem value="spice">Spice</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity Available</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                value={formData.quantity_available}
                onChange={(e) => setFormData({ ...formData, quantity_available: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.quantity_unit}
                onValueChange={(value) => setFormData({ ...formData, quantity_unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tons">Tons</SelectItem>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="quintal">Quintal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Price per Unit (₹)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price_per_unit}
                onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="quality">Quality Grade</Label>
              <Select
                value={formData.quality_grade}
                onValueChange={(value) => setFormData({ ...formData, quality_grade: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Farm location"
              />
            </div>

            <div>
              <Label htmlFor="harvest_date">Harvest Date</Label>
              <Input
                id="harvest_date"
                type="date"
                value={formData.harvest_date}
                onChange={(e) => setFormData({ ...formData, harvest_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="organic"
              checked={formData.organic_certified}
              onCheckedChange={(checked) => setFormData({ ...formData, organic_certified: checked })}
            />
            <Label htmlFor="organic">Organic Certified</Label>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button type="submit" className="bg-crop-green hover:bg-crop-green/90" disabled={createProduct.isPending}>
              {createProduct.isPending ? 'Submitting...' : 'Submit Product'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductSubmissionForm;
