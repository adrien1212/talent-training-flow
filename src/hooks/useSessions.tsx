// src/hooks/useSessions.ts

import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { SessionDetail } from '@/types/SessionDetail';
import { SessionStatus } from '@/types/SessionStatus';
import { NewSession } from '@/types/NewSession';
import { Newspaper } from 'lucide-react';

export interface UseSessionsOptions {
    trainingId?: number; // quand on crée une session
    trainerId?: number
    sessionStatus?: SessionStatus;
    startDate?: string,
    endDate?: string
    page?: number;
    size?: number;
    enabled?: boolean;
}

export type UseTodaySessionsOptions = UseSessionsOptions & {
    ofDay: string;
}

/**
 * Build a stable key for list queries
 */
const sessionsKeys = ({
    trainingId,
    trainerId,
    sessionStatus,
    startDate,
    endDate,
    page = 0,
    size = 10,
}: UseSessionsOptions) =>
    ['sessions', trainingId, trainerId, sessionStatus, startDate, endDate, page, size] as const;

const todayKeys = ({
    ofDay,
    trainingId,
    trainerId,
    sessionStatus,
    page = 0,
    size = 10,
}: UseTodaySessionsOptions) =>
    ['sessions-today', trainingId, trainerId, sessionStatus, page, size] as const;

/**
 * Query key for single session
 */
const sessionKey = (id?: number) => ['session', id] as const;

/**
 * READ: list & paginate sessions
 */
export function useSessions(options: UseSessionsOptions = {}) {
    const {
        trainingId,
        trainerId,
        sessionStatus,
        startDate,
        endDate,
        page = 0,
        size = 10,
        enabled = true,
    } = options;
    const key = sessionsKeys({ trainingId, trainerId, sessionStatus, startDate, endDate, page, size });

    return useQuery<PageResponse<SessionDetail>, Error>(
        key,
        () =>
            api
                .get<PageResponse<SessionDetail>>('/v1/sessions', {
                    params: { trainingId, sessionStatus, startDate, endDate, page, size },
                })
                .then(res => res.data),
        {
            enabled,
            staleTime: 0,
            cacheTime: 0,
            refetchOnMount: 'always',
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        }
    );
}

/**
 * READ: get one session by ID
 */
export function useSession(id?: number, enabled: boolean = true) {
    return useQuery<SessionDetail, Error>(
        sessionKey(id),
        () => api.get<SessionDetail>(`/v1/sessions/${id}`).then(res => res.data),
        {
            enabled: !!id && enabled,
            staleTime: 0,
        }
    );
}

/**
 * CREATE: add a new session
 */
export function useCreateSession(options: UseSessionsOptions = {}) {
    const qc = useQueryClient();
    const key = sessionsKeys(options);


    return useMutation(
        (newSession: NewSession) =>
            api.post<SessionDetail>(`/v1/trainings/${options.trainingId}/session`, newSession).then(res => res.data),
        {
            onSuccess: () => {
                qc.invalidateQueries(key);
            },
        }
    );
}

/**
 * OPEN
 */
export function useOpenSession() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            api.post<SessionDetail>(`/v1/sessions/${id}/open`).then(res => res.data),
        onSuccess: (_data, id) => {
            qc.invalidateQueries(['session', id]);
        },
    });
}

/**
 * COMPLETE 
 */
export function useCompleteSession() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            api.post<SessionDetail>(`/v1/sessions/${id}/complete`).then(res => res.data),
        onSuccess: (_data, id) => {
            qc.invalidateQueries(['session', id]);
        },
    });
}


/**
 * UPDATE: modify existing session
 */
export function useUpdateSession(options: UseSessionsOptions = {}) {
    const qc = useQueryClient();
    const key = sessionsKeys(options);

    return useMutation<
        SessionDetail,
        Error,
        { id: number; data: NewSession }
    >(
        ({ id, data }) =>
            api.put<SessionDetail>(`/v1/sessions/${id}`, data).then(res => res.data),
        {
            onSuccess: () => {
                qc.invalidateQueries(key);
            },
        }
    );
}

/**
 * DELETE: remove a session
 */
export function useDeleteSession(options: UseSessionsOptions = {}) {
    const qc = useQueryClient();
    const key = sessionsKeys(options);

    return useMutation(
        (id: number) => api.delete(`/v1/sessions/${id}`),
        {
            onSuccess: () => {
                qc.invalidateQueries(key);
            }
        }
    );
}

/**
 * COUNT
 */
export function useCountSessions(sessionStatus?: SessionStatus, enabled: boolean = true) {
    return useQuery<number, Error>(
        sessionKey(),
        () => api.get<number>(`/v1/sessions/count`, {
            params: { sessionStatus }
        }).then(res => res.data),

        {
            enabled: enabled,
            staleTime: 0,
        }
    );
}

/**
 * TODAY /
 */
export function useTodaySessions(options: UseTodaySessionsOptions) {
    const {
        ofDay,
        trainingId,
        trainerId,
        sessionStatus,
        page = 0,
        size = 10,
        enabled = true,
    } = options;
    const key = todayKeys({ ofDay, trainingId, trainerId, sessionStatus, page, size });

    return useQuery<PageResponse<SessionDetail>, Error>(
        key,
        () =>
            api
                .get<PageResponse<SessionDetail>>('/v1/sessions/ofDay', {
                    params: { date: ofDay, trainingId, sessionStatus, page, size },
                })
                .then(res => res.data),
        {
            enabled,
            staleTime: 0,
            cacheTime: 0,
            refetchOnMount: 'always',
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        }
    );
}

/**
 * SUBSCRIBE employee to a session
 */
export function useSubscribeEmployeeToSession(sessionId: number) {
    const qc = useQueryClient();

    return useMutation(
        (empId: number) =>
            api
                .post(`/v1/sessions/${sessionId}/subscribe/${empId}`)
                .then(res => res.data),
        {
            onSuccess: () => {
                // Invalidate enrollment list for this session
                qc.invalidateQueries(['session-enrollments', sessionId]);
            },
        }
    );
}

/**
 * UNSUBSCRIBE employee from a session
 */
export function useUnsubscribeEmployeeFromSession(sessionId: number) {
    const qc = useQueryClient();

    return useMutation(
        (empId: number) =>
            api
                .delete(`/v1/sessions/${sessionId}/subscribe/${empId}`)
                .then(res => res.data),
        {
            onSuccess: () => {
                // Invalidate enrollment list for this session
                qc.invalidateQueries(['session-enrollments', sessionId]);
            },
        }
    );
}