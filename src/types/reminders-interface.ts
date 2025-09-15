export interface RemindersBody {
  user_id: string;
  maintenance_id: string;
  due_date: string;
  is_sent?: boolean;
}

export interface UpdateRemindersBody {
  maintenance_id: string;
  due_date: string;
  is_sent?: boolean;
}
