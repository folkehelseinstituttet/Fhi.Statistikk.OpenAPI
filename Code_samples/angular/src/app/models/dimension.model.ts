export interface DimensionsArray {
  dimensions: Array<DimensionWithCategory>;
}

export interface DimensionWithCategory {
  code: string;
  label: string;
  categories: Array<CategoryWithChildren>;
}

export interface CategoryWithChildren {
  label: string;
  value: string;
  children?: Array<CategoryWithChildren> | null;
}
