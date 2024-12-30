export interface UserActivitiesRequestData {
  userId?: string;
  accessToken?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogRequestData {
  userId?: string;
  tableName?: string;
  requestContent?: string;
  oldData?: string;
  newData?: string;
  ipAddress?: string;
  userAgent?: string;
  responseContent?: string;
}
