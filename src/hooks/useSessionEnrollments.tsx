import { useQuery } from 'react-query';
import api from '@/services/api';
import { SessionEnrollment } from '@/types/SessionEnrollment';
import { PageResponse } from '@/types/PageResponse';
import { SessionStatus } from '@/types/SessionStatus';

interface UseSessionEnrollmentsOptions {
    trainingId?: number;
    sessionId?: number;
    employeeId?: number;
    status?: SessionStatus;
    completed?: boolean;
    page?: number;
    size?: number;
}

/**
 * Fetches session enrollments, optionally filtered by training, session, employee, status.
 * Automatically disabled until sessionId is provided.
 */
function useSessionEnrollments({
    trainingId,
    sessionId,
    employeeId,
    status,
    completed,
    page = 0,
    size = 10,
}: UseSessionEnrollmentsOptions) {
    const queryKey = [
        'sessionEnrollments',
        { trainingId, sessionId, employeeId, status, completed, page, size },
    ];

    const fetchEnrollments = () =>
        api
            .get<PageResponse<SessionEnrollment>>('/v1/sessions-enrollment', {
                params: {
                    trainingId,
                    sessionId,
                    employeeId,
                    sessionStatus: status,
                    completed,
                    page,
                    size,
                },
            })
            .then(res => res.data);

    const result = useQuery<PageResponse<SessionEnrollment>>(
        queryKey,
        fetchEnrollments,
        {
            keepPreviousData: true
        }
    );

    return {
        /**
         * Page response containing enrollment entries
         */
        data: result.data,
        /** True when loading enrollments */
        isLoading: result.isLoading,
        /** Error if fetch failed */
        isError: result.isError,
        /** Function to manually refetch enrollments */
        refetch: result.refetch,
    };
}

export default useSessionEnrollments;