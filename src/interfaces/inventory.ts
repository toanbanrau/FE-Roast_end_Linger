// Inventory Lot Interface
export interface IInventoryLot {
  id: number;
  lot_number: string;
  product_id: number;
  product_variant_id?: number;
  supplier_name?: string;
  supplier_code?: string;
  quantity: number;
  remaining_quantity: number;
  unit_cost: string;
  total_cost: string;
  manufacturing_date?: string;
  expiry_date?: string;
  import_date?: string;
  storage_location?: string;
  status: 'active' | 'expired' | 'inactive';
  notes?: string;
  product: {
    id: number;
    product_name: string;
    sku: string;
  };
  product_variant?: {
    id: number;
    variant_name: string;
    sku_code: string;
  };
  created_at: string;
  updated_at: string;
}

// Import Inventory Request
export interface IImportInventoryRequest {
  product_id: number;
  product_variant_id?: number;
  supplier_name?: string;
  supplier_code?: string;
  quantity: number;
  unit_cost: number;
  manufacturing_date?: string;
  expiry_date?: string;
  import_date?: string;
  storage_location?: string;
  notes?: string;
}

// Export Inventory Request
export interface IExportInventoryRequest {
  product_id: number;
  product_variant_id?: number;
  quantity: number;
  notes?: string;
}

// Return Inventory Request
export interface IReturnInventoryRequest {
  product_id: number;
  product_variant_id?: number;
  quantity: number;
  order_id?: number;
  lot_id?: number;
  notes?: string;
}

// Export Response
export interface IExportInventoryResponse {
  exported_quantity: number;
  lots_affected: {
    lot_id: number;
    lot_number: string;
    quantity_exported: number;
    remaining_quantity: number;
  }[];
  transaction_code: string;
}

// Return Response
export interface IReturnInventoryResponse {
  returned_quantity: number;
  lot_updated: {
    lot_id: number;
    lot_number: string;
    remaining_quantity: number;
  };
  transaction_code: string;
}

// Expiring Product
export interface IExpiringProduct {
  id: number;
  lot_number: string;
  product_name: string;
  variant_name?: string;
  remaining_quantity: number;
  expiry_date: string;
  days_until_expiry: number;
  storage_location?: string;
  unit_cost: string;
  total_value: string;
}

// Expired Product
export interface IExpiredProduct {
  id: number;
  lot_number: string;
  product_name: string;
  variant_name?: string;
  remaining_quantity: number;
  expiry_date: string;
  days_expired: number;
  storage_location?: string;
  unit_cost: string;
  total_value: string;
  status: string;
}

// Process Expired Response
export interface IProcessExpiredResponse {
  processed_lots: {
    lot_id: number;
    lot_number: string;
    quantity_processed: number;
    action: string;
  }[];
  total_processed: number;
}

// Pagination Response
export interface IInventoryLotsResponse {
  current_page: number;
  data: IInventoryLot[];
  total: number;
  per_page: number;
  last_page: number;
}

// Query Parameters
export interface IInventoryLotsQuery {
  page?: number;
  per_page?: number;
  product_id?: number;
  status?: string;
  storage_location?: string;
  search?: string;
}

export interface IExpiringQuery {
  days?: number;
  per_page?: number;
}
