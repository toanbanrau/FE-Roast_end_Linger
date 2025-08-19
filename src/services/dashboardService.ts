import { clientAxios } from "../configs/config";

// Interface cho dashboard statistics
export interface DashboardOverview {
  total_revenue: string;
  total_orders: number;
  total_customers: number;
  total_products: number;
  average_order_value: string;
}

export interface DashboardGrowth {
  revenue_growth: number;
  orders_growth: number;
  customers_growth: number;
  products_growth: number;
}

export interface RecentStats {
  today: {
    revenue: string;
    orders: number;
    users: number;
  };
  this_week: {
    revenue: string;
    orders: number;
    users: number;
  };
  this_month: {
    revenue: string;
    orders: number;
    users: number;
  };
}

export interface RevenueTrendItem {
  date: string;
  revenue: string;
  orders: number;
}

export interface OrderStatusDistribution {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TopCategory {
  category_id: number;
  category_name: string;
  revenue: string;
  orders: number;
  percentage: number;
}

export interface DashboardCharts {
  revenue_trend: RevenueTrendItem[];
  order_status_distribution: OrderStatusDistribution[];
  top_categories: TopCategory[];
}

export interface DailyBreakdown {
  date: string;
  total_orders: number;
  total_revenue: string;
  avg_order_value: string;
  unique_customers: number;
}

export interface WeeklyBreakdown {
  week: string;
  week_start: string;
  week_end: string;
  total_orders: number;
  total_revenue: string;
  avg_order_value: string;
}

export interface MonthlyComparison {
  month: string;
  year: number;
  month_number: number;
  total_orders: number;
  total_revenue: string;
  avg_order_value: string;
}

export interface HourlyPattern {
  hour: number;
  hour_display: string;
  total_orders: number;
  total_revenue: string;
}

export interface DetailedStats {
  daily_breakdown: DailyBreakdown[];
  weekly_breakdown: WeeklyBreakdown[];
  monthly_comparison: MonthlyComparison[];
  hourly_pattern: HourlyPattern[];
}

export interface DashboardPeriod {
  type: string;
  start_date: string;
  end_date: string;
  timezone: string;
}

export interface DashboardStatistics {
  overview: DashboardOverview;
  growth: DashboardGrowth;
  recent_stats: RecentStats;
  charts: DashboardCharts;
  detailed_stats: DetailedStats;
  period: DashboardPeriod;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardStatistics;
  timestamp: string;
}

// Parameters cho API call
export interface DashboardParams {
  period?: 'today' | 'week' | 'month' | 'year' | 'custom';
  start_date?: string;
  end_date?: string;
  include_charts?: boolean;
  timezone?: string;
  status?: 'completed' | 'all'; // Thêm filter cho status
}

// API function để lấy dashboard statistics
export const getDashboardStatistics = async (params?: DashboardParams): Promise<DashboardResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.period) {
    queryParams.set('period', params.period);
  }

  if (params?.start_date) {
    queryParams.set('start_date', params.start_date);
  }

  if (params?.end_date) {
    queryParams.set('end_date', params.end_date);
  }

  if (params?.include_charts !== undefined) {
    queryParams.set('include_charts', params.include_charts ? '1' : '0');
  }

  if (params?.timezone) {
    queryParams.set('timezone', params.timezone);
  }

  if (params?.status) {
    queryParams.set('status', params.status);
  }

  const url = `/admin/statistics/dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  console.log('🔍 Calling dashboard API:', url);
  console.log('🔍 Params:', params);

  const response = await clientAxios.get(url);

  console.log('✅ Dashboard statistics fetched successfully:', response.data);

  return response.data;
};

// Helper function để format currency
export const formatCurrency = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return numValue.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  });
};

// Helper function để format percentage
export const formatPercentage = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
};

// Helper function để get growth color
export const getGrowthColor = (value: number): string => {
  if (value > 0) return '#52c41a'; // Green for positive growth
  if (value < 0) return '#ff4d4f'; // Red for negative growth
  return '#8c8c8c'; // Gray for no change
};
