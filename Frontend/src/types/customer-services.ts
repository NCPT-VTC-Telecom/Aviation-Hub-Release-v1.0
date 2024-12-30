interface UserSender {
  id: string;
  fullname: string;
  email: string;
  phone_number: string;
  gender: string | null;
  citizen_id: string | null;
  address: string | null;
  ward: string | null;
  district: string | null;
  province: string | null;
  country: string | null;
  postcode: string | null;
  username: string;
  status_id: number;
  modified_date: string | null;
  deleted_date: string | null;
}

export interface DataMail {
  id: number;
  request_number: string;
  title_sender: string;
  body_sender: string;
  user_sender_id: string;
  body_receiver: string;
  user_receiver_id: string;
  status_id: number;
  modified_date: string;
  created_date: string;
  user_sender: UserSender;
}

export interface ResponseMail {
  adminId?: string | null;
  bodyReceiver?: string | null;
  statusId?: number;
}
