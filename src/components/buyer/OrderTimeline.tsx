
import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { OrderTimeline as OrderTimelineType } from '@/types/order';

interface OrderTimelineProps {
  timeline: OrderTimelineType[];
}

const OrderTimeline = ({ timeline }: OrderTimelineProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Order Progress</h3>
      <div className="space-y-3">
        {timeline.map((item, index) => (
          <div key={item.status} className="flex items-start space-x-3">
            <div className="flex flex-col items-center">
              {item.completed ? (
                <CheckCircle className="h-5 w-5 text-crop-green" />
              ) : index === timeline.findIndex(t => !t.completed) ? (
                <Clock className="h-5 w-5 text-harvest-yellow" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              {index < timeline.length - 1 && (
                <div className={`w-0.5 h-8 mt-2 ${
                  item.completed ? 'bg-crop-green' : 'bg-border'
                }`} />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className={`font-medium ${
                item.completed ? 'text-crop-green' : 
                index === timeline.findIndex(t => !t.completed) ? 'text-harvest-yellow' : 
                'text-muted-foreground'
              }`}>
                {item.description}
              </p>
              {item.completed && (
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(item.timestamp).toLocaleString('en-IN')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTimeline;
