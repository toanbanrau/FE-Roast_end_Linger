// Attribute interfaces
export interface IAttribute {
  id: number;
  attribute_name: string;
  attribute_type: string;
  description: string;
  is_required: boolean;
  sort_order: number;
  status: boolean;
  created_at?: string;
  updated_at?: string;
  attribute_values?: IAttributeValue[];
}

export interface IAttributeValue {
  id: number;
  attribute_id: number;
  value: string;
  price_adjustment?: string;
  sort_order: number;
  status: boolean;
  created_at?: string;
  updated_at?: string;
  attribute?: {
    id: number;
    attribute_name: string;
  };
}

// Request/Response interfaces
export interface ICreateAttributeRequest {
  attribute_name: string;
  attribute_type: string;
  description: string;
  is_required: boolean;
  sort_order: number;
  status: boolean;
}

export interface IUpdateAttributeRequest {
  attribute_name?: string;
  attribute_type?: string;
  description?: string;
  is_required?: boolean;
  sort_order?: number;
  status?: boolean;
}

export interface ICreateAttributeValueRequest {
  value: string;
  price_adjustment?: number;
  sort_order?: number;
  status: boolean;
}

export interface IUpdateAttributeValueRequest {
  value?: string;
  price_adjustment?: number;
  sort_order?: number;
  status?: boolean;
}

export interface IBulkCreateAttributeValuesRequest {
  values: {
    value: string;
    price_adjustment?: number;
    status: boolean;
  }[];
}

export interface IBulkDeleteRequest {
  ids: number[];
}

export interface IReorderAttributesRequest {
  attributes: {
    id: number;
    sort_order: number;
  }[];
}

// Response interfaces
export interface IAttributeResponse {
  success: boolean;
  data: IAttribute;
  message: string;
}

export interface IAttributesResponse {
  success: boolean;
  data: IAttribute[];
  message: string;
}

export interface IAttributeValueResponse {
  success: boolean;
  data: IAttributeValue;
  message: string;
}

export interface IAttributeValuesResponse {
  success: boolean;
  data: {
    attribute: {
      id: number;
      attribute_name: string;
      attribute_type: string;
    };
    values: IAttributeValue[];
  };
  message: string;
}

export interface IBulkDeleteResponse {
  success: boolean;
  message: string;
  data: {
    deleted_count: number;
    failed_count: number;
    failed_items: {
      id: number;
      name?: string;
      value?: string;
      attribute?: string;
      reason: string;
    }[];
  };
}

export interface IToggleStatusResponse {
  success: boolean;
  data: {
    id: number;
    status: boolean;
  };
  message: string;
}

// Attribute combination interfaces
export interface IAttributeCombination {
  attribute_id: number;
  attribute_name: string;
  value_id: number;
  value: string;
  price_adjustment: string;
}

export interface IAttributeCombinationsResponse {
  success: boolean;
  data: {
    attributes: IAttribute[];
    combinations: IAttributeCombination[][];
    total_combinations: number;
  };
  message: string;
}

export interface IUsedCombination {
  variant_id: number;
  variant_name: string;
  sku_code: string;
  product_name: string;
  combination: string;
}

export interface IUsedCombinationsResponse {
  success: boolean;
  data: IUsedCombination[];
  message: string;
}

// Query parameters
export interface IAttributeQueryParams {
  status?: boolean;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface IAttributeValueQueryParams {
  status?: boolean;
  search?: string;
  attribute_id?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  per_page?: number;
}
