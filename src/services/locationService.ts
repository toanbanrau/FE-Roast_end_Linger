import axios from 'axios';

const locationAPI = axios.create({
  baseURL: 'https://provinces.open-api.vn/api',
  timeout: 10000,
});

// Interfaces
export interface Province {
  code: number;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  code_name: string;
}

export interface District {
  code: number;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  code_name: string;
  province_code: number;
}

export interface Ward {
  code: number;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  code_name: string;
  district_code: number;
}

// API calls
export const getProvinces = async (): Promise<Province[]> => {
  try {
    const response = await locationAPI.get('/p/');
    return response.data;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    throw new Error('Không thể tải danh sách tỉnh thành');
  }
};

export const getDistrictsByProvince = async (provinceCode: number): Promise<District[]> => {
  try {
    const response = await locationAPI.get(`/p/${provinceCode}?depth=2`);
    return response.data.districts || [];
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw new Error('Không thể tải danh sách quận huyện');
  }
};

export const getWardsByDistrict = async (districtCode: number): Promise<Ward[]> => {
  try {
    const response = await locationAPI.get(`/d/${districtCode}?depth=2`);
    return response.data.wards || [];
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw new Error('Không thể tải danh sách phường xã');
  }
};

// Search functions for autocomplete
export const searchProvinces = async (query: string): Promise<Province[]> => {
  try {
    const provinces = await getProvinces();
    return provinces.filter(province => 
      province.name.toLowerCase().includes(query.toLowerCase()) ||
      province.full_name.toLowerCase().includes(query.toLowerCase()) ||
      province.code_name.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching provinces:', error);
    return [];
  }
};

export const searchDistricts = async (provinceCode: number, query: string): Promise<District[]> => {
  try {
    const districts = await getDistrictsByProvince(provinceCode);
    return districts.filter(district => 
      district.name.toLowerCase().includes(query.toLowerCase()) ||
      district.full_name.toLowerCase().includes(query.toLowerCase()) ||
      district.code_name.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching districts:', error);
    return [];
  }
};

export const searchWards = async (districtCode: number, query: string): Promise<Ward[]> => {
  try {
    const wards = await getWardsByDistrict(districtCode);
    return wards.filter(ward => 
      ward.name.toLowerCase().includes(query.toLowerCase()) ||
      ward.full_name.toLowerCase().includes(query.toLowerCase()) ||
      ward.code_name.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching wards:', error);
    return [];
  }
};
