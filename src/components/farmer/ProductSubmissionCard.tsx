
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import InteractiveButton from '@/components/ui/interactive-button';
import GradientCard from '@/components/ui/gradient-card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ProductSubmissionForm from './ProductSubmissionForm';

const ProductSubmissionCard = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <GradientCard gradient="from-crop-green/10 to-crop-field/5">
        <CardContent className="p-4 sm:p-6 text-center">
          <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-crop-green mx-auto mb-3 sm:mb-4" />
          <h3 className="font-bold text-base sm:text-lg mb-2">Submit New Product</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Upload your produce for admin review</p>
          <InteractiveButton 
            className="bg-crop-green hover:bg-crop-green/90 w-full sm:w-auto" 
            glow
            onClick={() => setShowForm(true)}
          >
            Add Product
          </InteractiveButton>
        </CardContent>
      </GradientCard>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ProductSubmissionForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductSubmissionCard;
