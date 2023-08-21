export interface Dataset {
  dimension: { [key: string]: DatasetDimension };
  id: Array<string>;
  label: string;
  size: Array<number>;
  status: string;
  updated: string;
  value: Array<number | string>;
  version: string;
  class?: string;
  href?: null;
  source?: null;
  role?: null;
}
export interface DatasetDimension {
  category: Category;
  label: string;
}

export interface Category {
  index: Array<string>;
  label: { [key: string]: string };
}
