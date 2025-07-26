
import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Truck, DollarSign } from 'lucide-react';
import InteractiveButton from '@/components/ui/interactive-button';
import GradientCard from '@/components/ui/gradient-card';
import ProductSubmissionCard from './ProductSubmissionCard';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CollectionScheduleView from './CollectionScheduleView';
import PaymentHistoryView from './PaymentHistoryView';

const QuickActionsGrid = () => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [showPayments, setShowPayments] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <ProductSubmissionCard />

        <GradientCard gradient="from-sky-blue/10 to-sky-deep/5">
          <CardContent className="p-4 sm:p-6 text-center">
            <Truck className="h-8 w-8 sm:h-12 sm:w-12 text-sky-blue mx-auto mb-3 sm:mb-4" />
            <h3 className="font-bold text-base sm:text-lg mb-2">Collection Schedule</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">View upcoming collection dates</p>
            <InteractiveButton 
              variant="outline" 
              className="border-sky-blue text-sky-blue w-full sm:w-auto"
              onClick={() => setShowSchedule(true)}
            >
              View Schedule
            </InteractiveButton>
          </CardContent>
        </GradientCard>

        <GradientCard gradient="from-green-500/10 to-green-600/5" className="sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6 text-center">
            <DollarSign className="h-8 w-8 sm:h-12 sm:w-12 text-green-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="font-bold text-base sm:text-lg mb-2">Payment History</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Track your instant payments</p>
            <InteractiveButton 
              variant="outline" 
              className="border-green-500 text-green-600 w-full sm:w-auto"
              onClick={() => setShowPayments(true)}
            >
              View Payments
            </InteractiveButton>
          </CardContent>
        </GradientCard>
      </div>

      <Dialog open={showSchedule} onOpenChange={setShowSchedule}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <CollectionScheduleView />
        </DialogContent>
      </Dialog>

      <Dialog open={showPayments} onOpenChange={setShowPayments}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <PaymentHistoryView />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickActionsGrid;
