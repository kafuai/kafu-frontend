export interface ReportingQueryFilter {
  field: string;
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains";
  value: string | number | boolean;
}

export interface ReportingQuery {
  dataSourceId: string;
  filters: ReportingQueryFilter[];
  groupBy?: string[];
  limit?: number;
}

export function normalizeReportingQuery(query: ReportingQuery): ReportingQuery {
  return {
    ...query,
    filters: query.filters ?? [],
    limit: query.limit && query.limit > 0 ? query.limit : 100,
  };
}
