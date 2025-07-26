
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, X, Eye, Phone, Mail, MapPin, Calendar, Package, User, Clock, ChevronDown, ChevronUp } from 'lucide-react';
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

interface EnhancedProductApprovalCardProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  adminNote: string;
  onNoteChange: (id: string, note: string) => void;
  isUpdating: boolean;
}

const EnhancedProductApprovalCard = ({
  product,
  isSelected,
  onToggleSelect,
  onApprove,
  onReject,
  adminNote,
  onNoteChange,
  isUpdating
}: EnhancedProductApprovalCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4 sm:p-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div className="flex items-start space-x-3 flex-1">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelect(product.id)}
                className="mt-1 flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(product.status)}>
                      {product.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="border-crop-green/30 text-crop-green">
                      Grade {product.quality_grade}
                    </Badge>
                    {product.organic_certified && (
                      <Badge className="bg-green-500 text-white text-xs">
                        Organic
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Package className="h-4 w-4 text-crop-green" />
                      <span className="text-xs font-medium text-gray-600">Category</span>
                    </div>
                    <p className="text-sm font-semibold capitalize">{product.category}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-gray-600">Quantity</span>
                    </div>
                    <p className="text-sm font-semibold">
                      {product.quantity_available} {product.quantity_unit}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-gray-600">Price</span>
                    </div>
                    <p className="text-sm font-semibold text-crop-green">
                      {formatCurrency(product.price_per_unit)}/{product.quantity_unit}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-xs font-medium text-gray-600">Submitted</span>
                    </div>
                    <p className="text-sm font-semibold">
                      {format(new Date(product.created_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                {/* Farmer Contact Info - Enhanced */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span>Farmer Contact Information</span>
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Name</p>
                      <p className="text-sm text-gray-900 font-semibold">
                        {product.farmer?.full_name || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
                      {product.farmer?.email ? (
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-blue-600 truncate flex-1">
                            {product.farmer.email}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-200 text-blue-700 hover:bg-blue-50 px-2 py-1 h-auto"
                            onClick={() => window.open(`mailto:${product.farmer.email}`, '_blank')}
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Not provided</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Phone</p>
                      {product.farmer?.phone ? (
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-green-600 font-medium flex-1">
                            {product.farmer.phone}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-200 text-green-700 hover:bg-green-50 px-2 py-1 h-auto"
                            onClick={() => window.open(`tel:${product.farmer.phone}`, '_blank')}
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Not provided</p>
                      )}
                    </div>
                  </div>

                  {product.location && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-gray-700">Location:</span>
                        <span className="text-sm text-gray-900">{product.location}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Expandable Details */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mb-4 p-0 h-auto text-blue-600 hover:text-blue-800"
                >
                  <span className="mr-2">
                    {isExpanded ? 'Hide Details' : 'Show More Details'}
                  </span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>

                {isExpanded && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
                    {product.description && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                        <p className="text-sm text-gray-700">{product.description}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.harvest_date && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Harvest Date</h5>
                          <p className="text-sm text-gray-700">
                            {format(new Date(product.harvest_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      )}
                      
                      {product.expiry_date && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Expiry Date</h5>
                          <p className="text-sm text-orange-600">
                            {format(new Date(product.expiry_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      )}
                    </div>

                    {product.images && product.images.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Product Images</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {product.images.slice(0, 6).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${product.name} ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Notes */}
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

            {/* Action Buttons */}
            <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
              <Button
                onClick={() => onApprove(product.id)}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-initial"
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                onClick={() => onReject(product.id)}
                disabled={isUpdating || !adminNote.trim()}
                variant="destructive"
                className="flex-1 sm:flex-initial"
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

export default EnhancedProductApprovalCard;
