// Contact interface
export interface IContact {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  subject?: string;
  message: string;
  status: 'new' | 'processing' | 'resolved';
  created_at: string;
  updated_at: string;
}

// Contact form interface for creating/updating
export interface IContactForm {
  full_name: string;
  email: string;
  phone_number?: string;
  subject?: string;
  message: string;
}

// Contact status update interface
export interface IContactStatusUpdate {
  status: 'new' | 'processing' | 'resolved';
}

// API Response wrapper
export interface ContactApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

// Paginated contacts response
export interface ContactsPaginatedResponse {
  current_page: number;
  data: IContact[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Contact filters interface
export interface IContactFilters {
  search?: string;
  status?: 'new' | 'processing' | 'resolved';
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

// Contact status definition
export interface IContactStatus {
  value: 'new' | 'processing' | 'resolved';
  label: string;
  color: string;
  description: string;
}

// Contact statistics interface
export interface IContactStats {
  total_contacts: number;
  new_contacts: number;
  processing_contacts: number;
  resolved_contacts: number;
  today_contacts: number;
  response_rate: number;
}