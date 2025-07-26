
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, X, Eye, Phone, Mail, MapPin, Calendar, Package, User, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Product {
  id: string;
  name: string;
  category: string;
  quantity_available: number;
  quantity_unit: string;
  price_per_unit: number;
  quality_grade: string;
  status: string;
  created_at: string;
  harvest_date?: string;
  expiry_date?: string;
  description?: string;
  images?: string[];
  location?: string;
  organic_certified?: boolean;
  farmer?: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

interface ProductApprovalCardProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  adminNote: string;
  onNoteChange: (id: string, note: string) => void;
  isUpdating: boolean;
}

const ProductApprovalCard = ({
  product,
  isSelected,
  onToggleSelect,
  onApprove,
  onReject,
  adminNote,
  onNoteChange,
  isUpdating
}: ProductApprovalCardProps) => {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'admin_review': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card key={product.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelect(product.id)}
                className="mt-1"
              />
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="border-crop-green/30 text-crop-green">
                    Grade {product.quality_grade}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Product Details</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><Package className="h-4 w-4 inline mr-2" />{product.category}</p>
                      <p><span className="font-medium">Quantity:</span> {product.quantity_available} {product.quantity_unit}</p>
                      <p><span className="font-medium">Price:</span> {formatCurrency(product.price_per_unit)} per {product.quantity_unit}</p>
                      {product.organic_certified && (
                        <Badge className="bg-green-500 text-white text-xs">Organic Certified</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Farmer Contact</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-crop-green" />
                        <span className="font-medium text-gray-900">{product.farmer?.full_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <a 
                          href={`mailto:${product.farmer?.email}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {product.farmer?.email}
                        </a>
                      </div>
                      {product.farmer?.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-green-500" />
                          <a 
                            href={`tel:${product.farmer.phone}`}
                            className="text-green-600 hover:underline text-sm font-medium"
                          >
                            {product.farmer.phone}
                          </a>
                        </div>
                      )}
                      {product.location && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <span className="text-gray-600 text-sm">{product.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Timeline</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><Clock className="h-4 w-4 inline mr-2" />Submitted: {format(new Date(product.created_at), 'MMM dd, yyyy')}</p>
                      {product.harvest_date && (
                        <p><Calendar className="h-4 w-4 inline mr-2" />Harvested: {format(new Date(product.harvest_date), 'MMM dd, yyyy')}</p>
                      )}
                      {product.expiry_date && (
                        <p className="text-orange-600"><Calendar className="h-4 w-4 inline mr-2" />Expires: {format(new Date(product.expiry_date), 'MMM dd, yyyy')}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => window.open(`mailto:${product.farmer?.email}`, '_blank')}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email Farmer
                  </Button>
                  {product.farmer?.phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => window.open(`tel:${product.farmer.phone}`, '_blank')}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call Farmer
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {expandedProduct === product.id ? 'Hide Details' : 'View Details'}
                  </Button>
                </div>

                {expandedProduct === product.id && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Product Description</h4>
                    <p className="text-gray-700 text-sm mb-4">
                      {product.description || 'No description provided'}
                    </p>
                    
                    {product.images && product.images.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Product Images</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {product.images.slice(0, 3).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${product.name} ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Add notes for this product review..."
                    value={adminNote}
                    onChange={(e) => onNoteChange(product.id, e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <Button
                onClick={() => onApprove(product.id)}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                onClick={() => onReject(product.id)}
                disabled={isUpdating}
                variant="destructive"
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductApprovalCard;
