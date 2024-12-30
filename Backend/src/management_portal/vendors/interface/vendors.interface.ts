export interface VendorListRequestData {
  page?: number;
  pageSize?: number;
  filters?: string;
}

export interface VendorRequestData {
  data: {
    fullname?: string;
    email?: string;
    phoneNumber?: string;
    description?: string;
    address?: string;
    ward?: string;
    district?: string;
    province?: string;
    expiredDate?: Date;
    username?: string;
    password?: string;
    ipAddresses?: string;
    userGroupIdLv1?: Array<number>;
    userGroupIdLv2?: Array<number>;
    userGroupIdLv3?: Array<number>;
  };
}
