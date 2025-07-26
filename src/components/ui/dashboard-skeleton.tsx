
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="w-64 bg-card border-r border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1">
          {/* Header */}
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StatsSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    {[...Array(4)].map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
              <Skeleton className="h-5 sm:h-6 w-12 sm:w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
