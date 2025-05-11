import {
  useQuery as useReactQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import { QueryKeys } from "../utils/query-keys";

export declare type QueryKey = [
  keyof typeof QueryKeys,
  string?,
  number?,
  ...(string | number | undefined)[]
];

export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  return useReactQuery({
    ...options,
    queryFn: options.queryFn,
    queryKey: options.queryKey,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: options.enabled ?? true,
    refetchInterval: options.refetchInterval ?? false,
    refetchOnMount: options.refetchOnMount !== false,
  });
}
