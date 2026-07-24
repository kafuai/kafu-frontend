"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";
import {
  resolveWorkspaceScope,
  type ResolvedWorkspaceScope,
} from "@/lib/workspace-identity/tenantResolver";

type WorkspaceScopeState = {
  scope: ResolvedWorkspaceScope | null;
  isLoading: boolean;
  error: string | null;
};

type WorkspaceScopeChangedEvent =
  CustomEvent<ResolvedWorkspaceScope>;

export function useWorkspaceScope() {
  const [state, setState] =
    useState<WorkspaceScopeState>({
      scope: null,
      isLoading: true,
      error: null,
    });

  const refresh = useCallback(async () => {
    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }));

    try {
      const scope =
        await resolveWorkspaceScope(
          supabase,
        );

      setState({
        scope,
        isLoading: false,
        error: null,
      });

      return scope;
    } catch (error) {
      console.error(
        "Unable to resolve workspace scope:",
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to resolve workspace scope.";

      setState({
        scope: null,
        isLoading: false,
        error: message,
      });

      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialScope() {
      try {
        const scope =
          await resolveWorkspaceScope(
            supabase,
          );

        if (!isMounted) {
          return;
        }

        setState({
          scope,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error(
          "Unable to load workspace scope:",
          error,
        );

        if (!isMounted) {
          return;
        }

        setState({
          scope: null,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load workspace scope.",
        });
      }
    }

    function handleScopeChange(
      event: Event,
    ) {
      const scopeChangedEvent =
        event as WorkspaceScopeChangedEvent;

      if (!scopeChangedEvent.detail) {
        return;
      }

      setState({
        scope: scopeChangedEvent.detail,
        isLoading: false,
        error: null,
      });
    }

    void loadInitialScope();

    window.addEventListener(
      "kafu:workspace-scope-changed",
      handleScopeChange,
    );

    return () => {
      isMounted = false;

      window.removeEventListener(
        "kafu:workspace-scope-changed",
        handleScopeChange,
      );
    };
  }, []);

  const isPortfolio =
    state.scope?.mode === "portfolio";

  const isCompany =
    state.scope?.mode === "company";

  const activeCompanyId =
    state.scope?.mode === "company"
      ? state.scope.activeCompanyId
      : null;

  const companyIds =
    state.scope?.companyIds ?? [];

  return {
    ...state,
    isPortfolio,
    isCompany,
    activeCompanyId,
    companyIds,
    refresh,
  };
}
