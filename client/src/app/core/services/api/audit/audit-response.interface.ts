export interface Audit {
  time: Date;
  user: string;
  role: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  url: string;
  ip: string;
  body: string;
}
