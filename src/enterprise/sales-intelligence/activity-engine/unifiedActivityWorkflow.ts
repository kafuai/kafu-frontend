import {
  loadUnifiedActivitySnapshot,
} from "./unifiedActivityRepository";

import type {
  UnifiedActivityQuery,
  UnifiedActivitySnapshot,
} from "./unifiedActivityTypes";

export class UnifiedActivityWorkflow {
  load(
    query: UnifiedActivityQuery,
  ): Promise<UnifiedActivitySnapshot> {
    return loadUnifiedActivitySnapshot(
      query,
    );
  }
}

export const unifiedActivityWorkflow =
  new UnifiedActivityWorkflow();
