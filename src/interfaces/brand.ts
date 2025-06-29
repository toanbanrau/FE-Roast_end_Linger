export interface IBrand {
  id: number;
  brand_name: string; // API trả về brand_name thay vì name
  description?: string;
  logo?: string;
  website?: string;
  status?: number;
}

export type IBrandCreate = Omit<IBrand, "id">;

