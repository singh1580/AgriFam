
import { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load admin components
const AdminProductsGrid = lazy(() => import('@/components/admin/AdminProductsGrid'));
const AdminOrdersTable = lazy(() => import('@/components/admin/AdminOrdersTable'));
const AdminPaymentsTable = lazy(() => import('@/components/admin/AdminPaymentsTable'));

// Loading components
const ProductsGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="h-48 w-full" />
    ))}
  </div>
);

const TableSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);

// Wrapper components with loading states
export const LazyAdminProductsGrid = (props: any) => (
  <Suspense fallback={<ProductsGridSkeleton />}>
    <AdminProductsGrid {...props} />
  </Suspense>
);

export const LazyAdminOrdersTable = (props: any) => (
  <Suspense fallback={<TableSkeleton />}>
    <AdminOrdersTable {...props} />
  </Suspense>
);

export const LazyAdminPaymentsTable = (props: any) => (
  <Suspense fallback={<TableSkeleton />}>
    <AdminPaymentsTable {...props} />
  </Suspense>
);
