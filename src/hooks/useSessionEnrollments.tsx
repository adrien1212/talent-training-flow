// hooks/useSessionEnrollments.ts
import { useQuery } from 'react-query';
import api from '@/services/api';
import { SessionEnrollment } from '@/types/SessionEnrollment';
import { PageResponse } from '@/types/PageResponse';
import { SessionStatus } from '@/types/SessionStatus';

interface Options {
    trainingId?: number;
    sessionId?: number;
    employeeId?: number
    status?: SessionStatus
    completed?: boolean
    page?: number;
    size?: number;
}

function useSessionEnrollments({
    trainingId,
    sessionId,
    employeeId,
    status,
    completed,
    page = 0,
    size = 10,
}: Options) {
    const key = ['sessionEnrollments', trainingId, sessionId, employeeId, status, completed, page];
    const queryFn = () =>
        api
            .get<PageResponse<SessionEnrollment>>('/v1/sessions-enrollment', {
                params: {
                    trainingId,
                    sessionId,
                    employeeId,
                    sessionStatus: status,
                    page,
                    size,
                },
            })
            .then(res => res.data);

    const { data, isLoading, error } = useQuery(key, queryFn, {
        keepPreviousData: true,
    });

    return {
        data,
        isLoading,
        error,
    };
}

export default useSessionEnrollments
