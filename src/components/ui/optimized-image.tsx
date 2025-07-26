
import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  className?: string;
}

const OptimizedImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ 
    src, 
    alt, 
    width, 
    height, 
    quality = 75, 
    priority = false, 
    placeholder = 'empty',
    className,
    ...props 
  }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Optimize Unsplash URLs
    const optimizedSrc = useMemo(() => {
      if (src.includes('unsplash.com')) {
        const params = new URLSearchParams();
        if (width) params.set('w', width.toString());
        if (height) params.set('h', height.toString());
        params.set('q', quality.toString());
        params.set('fit', 'crop');
        params.set('auto', 'format');
        
        return `${src}?${params.toString()}`;
      }
      return src;
    }, [src, width, height, quality]);

    const handleLoad = useCallback(() => {
      setIsLoading(false);
    }, []);

    const handleError = useCallback(() => {
      setIsLoading(false);
      setHasError(true);
    }, []);

    if (hasError) {
      return (
        <div 
          className={cn(
            "flex items-center justify-center bg-muted rounded-lg",
            className
          )}
          style={{ width, height }}
        >
          <span className="text-xs text-muted-foreground">Image failed to load</span>
        </div>
      );
    }

    return (
      <div className={cn("relative overflow-hidden", className)}>
        {isLoading && placeholder === 'blur' && (
          <div 
            className="absolute inset-0 bg-muted animate-pulse rounded-lg"
            style={{ width, height }}
          />
        )}
        <img
          ref={ref}
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
