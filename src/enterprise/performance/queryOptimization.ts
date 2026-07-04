export type QueryOptimizationModel = {
  id: string;
  queryName: string;
  averageExecutionMs: number;
  rowsScanned: number;
  indexUsed: boolean;
};

export type QueryOptimizationRecommendation = {
  queryId: string;
  recommendation:
    | "add_index"
    | "reduce_rows_scanned"
    | "optimize_join"
    | "keep_current";
};

export function analyzeQueryOptimization(
  query: QueryOptimizationModel,
): QueryOptimizationRecommendation {
  if (!query.indexUsed && query.rowsScanned > 1000) {
    return {
      queryId: query.id,
      recommendation: "add_index",
    };
  }

  if (query.rowsScanned > 10000) {
    return {
      queryId: query.id,
      recommendation: "reduce_rows_scanned",
    };
  }

  if (query.averageExecutionMs > 1000) {
    return {
      queryId: query.id,
      recommendation: "optimize_join",
    };
  }

  return {
    queryId: query.id,
    recommendation: "keep_current",
  };
}