/**
 * 순찰(Patrol) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPatrolList,
  getPatrolPlan,
  postPatrolPlan,
  putPatrolPlan,
  getPatrolTeamList,
  getPatrolTeam,
  postPatrolTeam,
  putPatrolTeam,
} from "@/lib/api/patrol";
import type {
  SearchPatrolPlanVO,
  SearchPatrolTeamVO,
  PatrolPlanVO,
  PatrolTeamVO,
} from "@/lib/types/patrol";

// ============================================================================
// Query Keys
// ============================================================================

export const patrolKeys = {
  all: ["patrols"] as const,
  lists: () => [...patrolKeys.all, "list"] as const,
  list: (params: SearchPatrolPlanVO) => [...patrolKeys.lists(), params] as const,
  details: () => [...patrolKeys.all, "detail"] as const,
  detail: (id: number) => [...patrolKeys.details(), id] as const,
};

export const patrolTeamKeys = {
  all: ["patrolTeams"] as const,
  lists: () => [...patrolTeamKeys.all, "list"] as const,
  list: (params: SearchPatrolTeamVO) => [...patrolTeamKeys.lists(), params] as const,
  details: () => [...patrolTeamKeys.all, "detail"] as const,
  detail: (id: number) => [...patrolTeamKeys.details(), id] as const,
};

// ============================================================================
// 순찰 계획 Query Hooks
// ============================================================================

/**
 * 순찰 계획 목록 조회 훅
 */
export function usePatrolList(params: SearchPatrolPlanVO) {
  return useQuery({
    queryKey: patrolKeys.list(params),
    queryFn: () => getPatrolList(params),
  });
}

/**
 * 순찰 계획 상세 조회 훅
 */
export function usePatrolPlan(id: number) {
  return useQuery({
    queryKey: patrolKeys.detail(id),
    queryFn: () => getPatrolPlan(id),
    enabled: id > 0,
  });
}

// ============================================================================
// 순찰 계획 Mutation Hooks
// ============================================================================

/**
 * 순찰 계획 등록 훅
 */
export function usePostPatrolPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PatrolPlanVO) => postPatrolPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patrolKeys.lists() });
    },
  });
}

/**
 * 순찰 계획 수정 훅
 */
export function usePutPatrolPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PatrolPlanVO) => putPatrolPlan(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: patrolKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: patrolKeys.detail(variables.id) });
      }
    },
  });
}

// ============================================================================
// 순찰 팀 Query Hooks
// ============================================================================

/**
 * 순찰 팀 목록 조회 훅
 */
export function usePatrolTeamList(params: SearchPatrolTeamVO) {
  return useQuery({
    queryKey: patrolTeamKeys.list(params),
    queryFn: () => getPatrolTeamList(params),
  });
}

/**
 * 순찰 팀 상세 조회 훅
 */
export function usePatrolTeam(id: number) {
  return useQuery({
    queryKey: patrolTeamKeys.detail(id),
    queryFn: () => getPatrolTeam(id),
    enabled: id > 0,
  });
}

// ============================================================================
// 순찰 팀 Mutation Hooks
// ============================================================================

/**
 * 순찰 팀 등록 훅
 */
export function usePostPatrolTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PatrolTeamVO) => postPatrolTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patrolTeamKeys.lists() });
    },
  });
}

/**
 * 순찰 팀 수정 훅
 */
export function usePutPatrolTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PatrolTeamVO) => putPatrolTeam(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: patrolTeamKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: patrolTeamKeys.detail(variables.id) });
      }
    },
  });
}
