export interface ResponseData {
  base_url: string;
  title: string;
  config: any;
  script: { available: number; js: string };
  css: { available: number; css: string };
  menu: string;
  data: Record<string, unknown>;
}