
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface NotificationToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

const NotificationToast = ({ 
  type, 
  title, 
  message, 
  onClose,
  className = '' 
}: NotificationToastProps) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const colors = {
    success: 'border-crop-green/30 bg-crop-green/10 text-crop-green',
    error: 'border-red-500/30 bg-red-500/10 text-red-600',
    warning: 'border-harvest-yellow/30 bg-harvest-yellow/10 text-harvest-yellow',
    info: 'border-sky-blue/30 bg-sky-blue/10 text-sky-blue'
  };

  const Icon = icons[type];

  return (
    <div className={cn(
      "relative p-4 border-2 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl",
      colors[type],
      className
    )}>
      <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          {message && (
            <p className="text-xs opacity-80 mt-1">{message}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationToast;
