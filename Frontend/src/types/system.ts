export interface LogsData {
  id: number;
  user_id: number | null;
  action_type: string;
  table_name: string;
  request_content: string;
  action_time: string;
  old_data: string | null;
  new_data: string | null;
  ipaddress: string;
  user_agent: string;
  response_content: string;
  created_date: string;
}
