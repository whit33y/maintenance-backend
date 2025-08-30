export interface RemindersBody {
  maintenance_id: string;
  due_date: string;
  is_sent?: boolean;
}
