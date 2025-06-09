import { useQuery } from 'react-query';
import api from '@/services/api';
import { PageResponse } from '@/types/PageResponse';
import { Feedback } from '@/types/Feedback';

interface Options {
    trainingId?: number;
    sessionId?: number;
    page?: number;
    size?: number;
}

function useFeedback({
    trainingId,
    sessionId,
    page = 0,
    size = 10,
}: Options) {
    const key = ['feedbacks', trainingId, sessionId, page];
    const queryFn = () =>
        api
            .get<PageResponse<Feedback>>('/v1/feedbacks', {
                params: {
                    trainingId,
                    sessionId,
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

export default useFeedback
