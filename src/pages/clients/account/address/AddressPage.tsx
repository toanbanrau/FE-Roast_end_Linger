import React from 'react';
import AccountNav from '../../../../components/AccountNav';
import AddressManagement from '../../../../components/address/AddressManagement';

export default function AddressPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">
        Quản Lý Địa Chỉ
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <AccountNav active="addresses" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <AddressManagement />
        </div>
      </div>
    </div>
  );
}
