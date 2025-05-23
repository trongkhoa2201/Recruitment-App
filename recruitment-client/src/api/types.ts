export interface JobPayload {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JobLog {
  _id: string;
  jobId: string;
  userId: string;
  action: string;
  description: string;
  timestamp: string;
}
