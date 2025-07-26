import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

export class PaymentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('PaymentErrorBoundary caught an error:', error, errorInfo);
    }
    
    // Log error for monitoring
    this.logError(error, errorInfo);
    
    this.props.onError?.(error, errorInfo);
  }

  logError = (error: Error, errorInfo: ErrorInfo) => {
    // In production, this would send to error monitoring service
    console.error('Payment Error:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  };

  handleRetry = () => {
    this.setState(prevState => ({ 
      hasError: false, 
      error: undefined,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isNetworkError = this.state.error?.message.includes('fetch') || 
                             this.state.error?.message.includes('network') ||
                             this.state.error?.message.includes('SSL');

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 space-y-6">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2">
              <div className="space-y-2">
                <p className="font-medium">
                  {isNetworkError ? 'Connection Error' : 'Something went wrong'}
                </p>
                <p className="text-sm">
                  {isNetworkError 
                    ? 'Unable to connect to the server. Please check your internet connection.'
                    : this.state.error?.message || 'An unexpected error occurred in the payment system'
                  }
                </p>
                {this.state.retryCount > 2 && (
                  <p className="text-xs text-muted-foreground">
                    Multiple retry attempts failed. Please refresh the page or contact support.
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={this.handleRetry}
              className="flex items-center space-x-2"
              variant="outline"
              disabled={this.state.retryCount > 5}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </Button>
            
            {this.state.retryCount > 2 && (
              <Button
                onClick={this.handleReload}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Reload Page</span>
              </Button>
            )}
          </div>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="w-full max-w-md">
              <summary className="text-sm font-medium cursor-pointer">Debug Info</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}