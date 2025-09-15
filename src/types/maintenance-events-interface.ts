export interface MaintenanceEventBody {
  user_id: string;
  maintenance_id: string;
  due_date: string;
  completion_date?: string;
  notes?: string;
}

export interface UpdateMaintenanceEventBody {
  completion_date?: string;
  notes?: string;
}
