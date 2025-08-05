export interface CoverageArea {
  city: string;
  districts: string[] | null;
}

export interface ShippingMethod {
  id: number;
  name: string;
  code: string;
  description: string;
  base_cost: string;
  cost_per_km: string;
  free_shipping_threshold: string | null;
  estimated_days_min: number;
  estimated_days_max: number;
  coverage_areas: CoverageArea[];
  max_weight: string | null;
  max_dimensions: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Interface for client API response from /api/shipping/methods
export interface IShippingMethod {
  id: number;
  code: string;
  name: string;
  description: string;
  cost: number; // API trả về number như 30000
  estimated_time: string;
}

export interface IShippingMethodsResponse {
  success: boolean;
  message: string;
  data: IShippingMethod[];
}