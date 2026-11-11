export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department?: string;
  token?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  unitCost: number;
  stock: number;
  sku: string;
  description?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  region: string;
  segment: 'Enterprise' | 'Mid-Market' | 'SMB' | 'Startup';
  totalSpent: number;
  ordersCount: number;
  phone?: string;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  manager: string;
  targetQuarterly: number;
}

export interface SaleRecord {
  id: string;
  orderId: string;
  orderDate: string; // YYYY-MM-DD
  productId: string;
  productName: string;
  category: string;
  customerId: string;
  customerName: string;
  region: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  revenue: number;
  cost: number;
  profit: number;
  marginPercent: number;
  paymentMethod: 'Credit Card' | 'Wire Transfer' | 'ACH' | 'PayPal';
  status: 'Completed' | 'Pending' | 'Shipped' | 'Cancelled';
}

export interface DashboardStats {
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  totalProducts: number;
  averageOrderValue: number;
  profitMargin: number;
  monthlyRevenue: number;
  salesGrowthPercentage: number;
  previousMonthRevenue: number;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  profit: number;
  orders: number;
}

export interface CategoryMetric {
  category: string;
  revenue: number;
  profit: number;
  quantity: number;
  sharePercent: number;
}

export interface RegionMetric {
  region: string;
  revenue: number;
  profit: number;
  orders: number;
}

export interface ProductPerformance {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  quantitySold: number;
  revenue: number;
  profit: number;
  marginPercent: number;
  rank: number;
}

export interface AiRecommendation {
  type: 'opportunity' | 'warning' | 'strategy' | 'forecast';
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  actionableStep: string;
  metricReference?: string;
}

export interface AiAnalysisResult {
  summary: string;
  keyFindings: string[];
  bestSellingProducts: { name: string; revenue: number; quantity: number; why: string }[];
  lowPerformingProducts: { name: string; revenue: number; inventoryWarning: string; suggestion: string }[];
  revenuePatterns: string[];
  salesTrendsPrediction: string;
  recommendations: AiRecommendation[];
  profitBoostingStrategies: string[];
  generatedAt: string;
}
