import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '@/backend';

export function useUserProfile() {
  const { actor, isFetching: isActorFetching } = useActor();
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading, isFetched } = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isActorFetching,
    retry: false,
  });

  const { mutateAsync: saveProfile, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.saveCallerUserProfile();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });

  return {
    userProfile,
    isLoading: isActorFetching || isLoading,
    isFetched: !!actor && isFetched,
    saveProfile,
    isSaving,
  };
}
