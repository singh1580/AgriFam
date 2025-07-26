
import React from 'react';
import AdminProductApprovalsGrid from './AdminProductApprovalsGrid';
import ProductAggregation from './ProductAggregation';

const AdminProductsPage = () => {
  return (
    <div className="space-y-6">
      <AdminProductApprovalsGrid />
      <ProductAggregation />
    </div>
  );
};

export default AdminProductsPage;
