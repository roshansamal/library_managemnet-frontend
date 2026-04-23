import type { IconType } from 'react-icons';

export interface MetricData {
  label: string;
  value: string | number;
  change: number;
  icon: IconType;
  color: string;
}