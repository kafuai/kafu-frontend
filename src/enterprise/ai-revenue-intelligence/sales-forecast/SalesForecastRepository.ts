import type {
  SalesForecast,
  SalesForecastHistoryQuery,
  SalesForecastQuery,
} from "./SalesForecastTypes";

export interface SalesForecastRepository {
  findLatest(
    query: SalesForecastQuery,
  ): Promise<SalesForecast | null>;

  findHistory(
    query: SalesForecastHistoryQuery,
  ): Promise<
    readonly SalesForecast[]
  >;

  save(
    forecast: SalesForecast,
  ): Promise<SalesForecast>;

  delete(
    query: SalesForecastQuery,
  ): Promise<void>;
}

export class SalesForecastRepositoryError
  extends Error {
  readonly code: string;
  readonly cause?: unknown;

  constructor(
    code: string,
    message: string,
    cause?: unknown,
  ) {
    super(message);

    this.name =
      "SalesForecastRepositoryError";

    this.code = code;
    this.cause = cause;
  }
}

export const assertSalesForecastRepository = (
  repository: SalesForecastRepository,
): SalesForecastRepository => {
  if (!repository) {
    throw new SalesForecastRepositoryError(
      "REPOSITORY_REQUIRED",
      "Sales forecast repository is required.",
    );
  }

  return repository;
};
