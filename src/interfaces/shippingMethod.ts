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