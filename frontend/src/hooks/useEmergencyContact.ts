import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { EmergencyContact } from '@/backend';

export function useEmergencyContact() {
  const { actor, isFetching: isActorFetching } = useActor();
  const queryClient = useQueryClient();

  const { data: contact, isLoading } = useQuery<EmergencyContact | null>({
    queryKey: ['emergencyContact'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getEmergencyContact();
    },
    enabled: !!actor && !isActorFetching,
  });

  const { mutateAsync: updateContact, isPending: isUpdating } = useMutation({
    mutationFn: async ({ fullName, number }: { fullName: string; number: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.setEmergencyContact({ fullName, number });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyContact'] });
    },
  });

  const updateContactWrapper = async (fullName: string, number: string) => {
    await updateContact({ fullName, number });
  };

  return {
    contact,
    isLoading,
    updateContact: updateContactWrapper,
    isUpdating,
  };
}
