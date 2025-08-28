export interface CreateMaintenanceBody {
  title: string;
  category_id: string;
  start_date: string;
  repeat_interval: string;
  reminder_days_before: number;
}

export interface UpdateMaintenanceBody extends CreateMaintenanceBody {
  completed: boolean;
}
