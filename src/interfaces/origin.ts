export interface IOrigin {
  id: number;
  origin_name: string;
  country: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface IOriginCreate {
  origin_name: string;
  country: string;
  description: string;
}

export interface IOriginUpdate {
  origin_name?: string;
  country?: string;
  description?: string;
}
