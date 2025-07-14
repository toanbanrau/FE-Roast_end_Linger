// Address Types
export type AddressType = 'home' | 'office' | 'other';

// Shipping Method Interface
export interface ShippingMethod {
  id: number;
  name: string;
  cost: number;
  estimated_delivery: string;
}

// User Address Interface
export interface UserAddress {
  id: number;
  label?: string;
  recipient_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  ward: string;
  district: string;
  city: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
  type: AddressType;
  type_display: string;
  type_icon: string;
  display_label: string;
  delivery_notes?: string;
  full_address: string;
  formatted_address: string;
  has_coordinates: boolean;
  is_complete: boolean;
  missing_fields?: string[];
  available_shipping_methods?: ShippingMethod[];
  created_at: string;
  updated_at?: string;
}

// Create Address Request
export interface CreateAddressRequest {
  label?: string;
  recipient_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  ward: string;
  district: string;
  city: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  type?: AddressType;
  delivery_notes?: string;
  is_default?: boolean;
}

// Update Address Request
export interface UpdateAddressRequest {
  label?: string;
  recipient_name?: string;
  phone_number?: string;
  address_line_1?: string;
  address_line_2?: string;
  ward?: string;
  district?: string;
  city?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  type?: AddressType;
  delivery_notes?: string;
  is_default?: boolean;
}

// API Response Types
export interface AddressResponse {
  success: boolean;
  message: string;
  data: UserAddress;
}

export interface AddressListResponse {
  success: boolean;
  message: string;
  data: UserAddress[];
}

export interface SetDefaultAddressResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    is_default: boolean;
    updated_at: string;
  };
}

export interface DeleteAddressResponse {
  success: boolean;
  message: string;
  data: null;
}

// Address Type Options for UI
export const ADDRESS_TYPE_OPTIONS = [
  { value: 'home', label: 'Nhà riêng', icon: '🏠' },
  { value: 'office', label: 'Văn phòng', icon: '🏢' },
  { value: 'other', label: 'Khác', icon: '📍' },
] as const;