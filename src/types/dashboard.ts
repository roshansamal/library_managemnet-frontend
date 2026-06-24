import type { LucideIcon } from 'lucide-react';

export interface StatMetric {
  id: string;
  title: string;
  value: string | number;
  trend: number; // Percentage change
  icon: LucideIcon;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}