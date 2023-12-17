import { FetchProducts } from '@/types';
import useSWR, { SWRConfiguration } from 'swr';

// const fetcher = (...args: [key: string]) => fetch(...args).then((res) => res.json());

export const useProducts = (url: string, config: SWRConfiguration = {}) => {
    // const { data, error } = useSWR<FetchProducts>(`/api${url}`, fetcher, {});
    const { data, error } = useSWR<FetchProducts>(`/api${url}`, config);

    return {
        products: data?.products,
        isLoading: !error && !data,
        isError: error,
    };
};
