export interface ResponseData {
  base_url: string;
  title: string;
  config: Record<string, unknown>;
  script: { available: number; js: string };
  css: { available: number; css: string };
  menu: string;
  data: Record<string, unknown>;
}