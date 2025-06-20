export interface ResponseData {
  base_url: string;
  title: string;
  config: Record<string, unknown>;
  script: { available: number; js: string };
  css: { available: number; css: string };
  menu: string;
  data: Record<string, unknown>;
  userData?: Record<string, unknown>;
}
export interface SendData {
  status: number;
  err: number;
  data: object | boolean; // More specific type than `object`
  msg: string;
}
 
export interface CallbackFunction {
  (result: SendData): void;
}
 
export interface SendMailOptions {
  from: string;
  to: string;
  subject: string;
  replyTo: string;
  text: string;
  html: string;
  bcc: string[] | null;
  attachments: any[] | null;
}
 
// Define types for function parameters
export interface EmailInfo {
  email_body: string;
  send_blind_copy_to?: string | string[];
  attachments?: Attachment[];
}
 
export interface Attachment {
  filename?: string;
  path?: string;
  content?: any;
  contentType?: string;
  [key: string]: any; // Allow additional properties
}
