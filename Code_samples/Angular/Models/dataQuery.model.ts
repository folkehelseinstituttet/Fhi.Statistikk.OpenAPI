export interface DataQuery {
  dimensions: Array<DataDimension>;
  response: Response;
}

export interface DataDimension {
  code: string;
  filter: string;
  values: Array<string>;
}

export interface Response {
  format: string;
}
