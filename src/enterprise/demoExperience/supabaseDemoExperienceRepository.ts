import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import type {
  DemoExperienceRepository,
} from "./demoExperienceRepository";
import type {
  DemoExperience,
  DemoExperienceSession,
  DemoExperienceStatus,
  DemoExperienceStep,
  DemoStepProgress,
} from "./demoExperienceTypes";

interface DemoExperienceRow {
  id: string;
  experience_key: string;
  name: string;
  description: string;
  status: DemoExperienceStatus;
  steps: DemoExperienceStep[];
  created_at: string;
  updated_at: string;
}

interface DemoExperienceSessionRow {
  id: string;
  experience_id: string;
  user_id: string;
  company_id: string | null;
  current_step_id: string | null;
  progress: DemoStepProgress[];
  started_at: string;
  completed_at: string | null;
}

function mapExperience(
  row: DemoExperienceRow,
): DemoExperience {
  return {
    id: row.id,
    key: row.experience_key,
    name: row.name,
    description: row.description,
    status: row.status,
    steps: row.steps ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSession(
  row: DemoExperienceSessionRow,
): DemoExperienceSession {
  return {
    id: row.id,
    experienceId: row.experience_id,
    userId: row.user_id,
    companyId:
      row.company_id ?? undefined,
    currentStepId:
      row.current_step_id,
    progress: row.progress ?? [],
    startedAt: row.started_at,
    completedAt:
      row.completed_at ?? undefined,
  };
}

export class SupabaseDemoExperienceRepository
  implements DemoExperienceRepository {
  constructor(
    private readonly client: SupabaseClient,
  ) {}

  async getExperienceById(
    experienceId: string,
  ): Promise<DemoExperience | null> {
    const {
      data,
      error,
    } = await this.client
      .from("demo_experiences")
      .select("*")
      .eq("id", experienceId)
      .maybeSingle<DemoExperienceRow>();

    if (error) {
      throw error;
    }

    return data
      ? mapExperience(data)
      : null;
  }

  async getExperienceByKey(
    experienceKey: string,
  ): Promise<DemoExperience | null> {
    const {
      data,
      error,
    } = await this.client
      .from("demo_experiences")
      .select("*")
      .eq("experience_key", experienceKey)
      .maybeSingle<DemoExperienceRow>();

    if (error) {
      throw error;
    }

    return data
      ? mapExperience(data)
      : null;
  }

  async listExperiences():
    Promise<readonly DemoExperience[]> {
    const {
      data,
      error,
    } = await this.client
      .from("demo_experiences")
      .select("*")
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      throw error;
    }

    return (
      (data ?? []) as DemoExperienceRow[]
    ).map(mapExperience);
  }

  async saveExperience(
    experience: DemoExperience,
  ): Promise<DemoExperience> {
    const {
      data,
      error,
    } = await this.client
      .from("demo_experiences")
      .upsert(
        {
          id: experience.id,
          experience_key:
            experience.key,
          name: experience.name,
          description:
            experience.description,
          status: experience.status,
          steps: experience.steps,
          created_at:
            experience.createdAt,
          updated_at:
            experience.updatedAt,
        },
        {
          onConflict: "id",
        },
      )
      .select("*")
      .single<DemoExperienceRow>();

    if (error) {
      throw error;
    }

    return mapExperience(data);
  }

  async getSession(
    sessionId: string,
  ): Promise<DemoExperienceSession | null> {
    const {
      data,
      error,
    } = await this.client
      .from("demo_experience_sessions")
      .select("*")
      .eq("id", sessionId)
      .maybeSingle<DemoExperienceSessionRow>();

    if (error) {
      throw error;
    }

    return data
      ? mapSession(data)
      : null;
  }

  async createSession(
    session: DemoExperienceSession,
  ): Promise<DemoExperienceSession> {
    const {
      data,
      error,
    } = await this.client
      .from("demo_experience_sessions")
      .insert({
        id: session.id,
        experience_id:
          session.experienceId,
        user_id: session.userId,
        company_id:
          session.companyId ?? null,
        current_step_id:
          session.currentStepId,
        progress: session.progress,
        started_at: session.startedAt,
        completed_at:
          session.completedAt ?? null,
      })
      .select("*")
      .single<DemoExperienceSessionRow>();

    if (error) {
      throw error;
    }

    return mapSession(data);
  }

  async updateSession(
    session: DemoExperienceSession,
  ): Promise<DemoExperienceSession> {
    const {
      data,
      error,
    } = await this.client
      .from("demo_experience_sessions")
      .update({
        current_step_id:
          session.currentStepId,
        progress: session.progress,
        completed_at:
          session.completedAt ?? null,
      })
      .eq("id", session.id)
      .select("*")
      .single<DemoExperienceSessionRow>();

    if (error) {
      throw error;
    }

    return mapSession(data);
  }
}
