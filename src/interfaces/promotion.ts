export interface IPromotion {
  id: number;
  promotion_name: string;
  promotion_code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string;
  minimum_order_value: string;
  maximum_discount_amount: string;
  start_date: string;
  end_date: string;
  usage_limit: number;
  used_count: number;
  applies_to: 'all' | 'specific_categories' | 'specific_products';
  status: boolean;
  created_at: string;
  updated_at: string;
  status_text?: string;
  discount_type_text?: string;
  formatted_discount_value?: string;
  is_usable?: boolean;
  is_expired?: boolean;
  is_used_up?: boolean;
}

export type IPromotionCreate = Omit<IPromotion, "id" | "created_at" | "updated_at" | "used_count" | "status_text" | "discount_type_text" | "formatted_discount_value" | "is_usable" | "is_expired" | "is_used_up">;
export type IPromotionUpdate = Partial<IPromotionCreate>;