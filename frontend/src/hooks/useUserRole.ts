import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useUserRole() {
  const { actor, isFetching: isActorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isActorFetching,
    retry: false,
  });

  return {
    isAdmin: query.data ?? false,
    isLoading: isActorFetching || query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
