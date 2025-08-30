type RepetitionUnit = 'day' | 'week' | 'month' | 'year';

export interface MaintenanceBody {
  title: string;
  start_date: string;
  repetition_unit: RepetitionUnit;
  repetition_value: number;
  category_id: string;
  notes?: string;
}
