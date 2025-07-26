
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateOrder } from '@/hooks/useOrderMutations';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Phone } from 'lucide-react';

interface AggregatedProduct {
  id: string;
  product_name: string;
  standard_price: number;
  quantity_unit: string;
  total_quantity: number;
  category: string;
  quality_grade: string;
  farmer_count: number;
  regions: string[];
}

interface OrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: AggregatedProduct | null;
}

const OrderDialog = ({ isOpen, onClose, product }: OrderDialogProps) => {
  const [quantity, setQuantity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const { toast } = useToast();
  const createOrderMutation = useCreateOrder();

  const validatePhoneNumber = (phoneNumber: string) => {
    // Indian phone number validation (10 digits, optionally starting with +91)
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber.replace(/\s+/g, ''));
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // If it starts with +91 or 91, format accordingly
    if (cleaned.startsWith('+91')) {
      const number = cleaned.substring(3);
      if (number.length <= 10) {
        return '+91 ' + number.replace(/(\d{5})(\d{5})/, '$1 $2');
      }
    } else if (cleaned.startsWith('91') && cleaned.length === 12) {
      const number = cleaned.substring(2);
      return '+91 ' + number.replace(/(\d{5})(\d{5})/, '$1 $2');
    } else if (cleaned.length <= 10 && !cleaned.startsWith('+')) {
      return cleaned.replace(/(\d{5})(\d{5})/, '$1 $2');
    }
    
    return phone;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(formatPhoneNumber(value));
    
    if (value && !validatePhoneNumber(value)) {
      setPhoneError('Please enter a valid Indian phone number');
    } else {
      setPhoneError('');
    }
  };

  const resetForm = () => {
    setQuantity('');
    setDeliveryAddress('');
    setPhone('');
    setSpecialInstructions('');
    setPhoneError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !quantity || !deliveryAddress || !phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!validatePhoneNumber(phone)) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive"
      });
      return;
    }

    if (quantityNum > product.total_quantity) {
      toast({
        title: "Error",
        description: `Maximum available quantity is ${product.total_quantity} ${product.quantity_unit}`,
        variant: "destructive"
      });
      return;
    }

    createOrderMutation.mutate({
      product_id: product.id,
      quantity: quantityNum,
      delivery_address: deliveryAddress,
      phone: phone,
      special_instructions: specialInstructions || undefined
    }, {
      onSuccess: () => {
        handleClose();
      }
    });
  };

  if (!product) return null;

  const totalPrice = parseFloat(quantity || '0') * product.standard_price;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Place Order - {product.product_name}</DialogTitle>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Category: {product.category} | Grade: {product.quality_grade}</p>
            <p>Available from {product.farmer_count} farmers in {product.regions.length} regions</p>
            <p className="text-amber-600 font-medium">Note: Delivery date will be confirmed by admin after order review</p>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity ({product.quantity_unit}) *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                min="0.1"
                max={product.total_quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Max: ${product.total_quantity}`}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+91 XXXXX XXXXX"
                className={phoneError ? 'border-red-500' : ''}
                required
              />
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="deliveryAddress">Delivery Address *</Label>
            <Textarea
              id="deliveryAddress"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter complete delivery address with landmark"
              className="min-h-[80px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requirements, quality specifications, or delivery instructions"
              className="min-h-[80px]"
            />
          </div>

          {quantity && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Order Summary:</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{quantity} {product.quantity_unit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span>₹{product.standard_price.toLocaleString()}/{product.quantity_unit}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total Amount:</span>
                  <span className="text-green-600">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createOrderMutation.isPending || !quantity || !deliveryAddress || !phone || !!phoneError}
            >
              {createOrderMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                'Place Order'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
