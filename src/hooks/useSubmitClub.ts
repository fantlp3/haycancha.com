import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitClubPending } from "@/lib/submissions";
import type { ClubPendingSubmission } from "@/lib/directus-types";

/**
 * Mutation hook for submitting a new club to the moderation queue.
 *
 * Usage:
 *   const { mutate, isPending, data } = useSubmitClub();
 *   mutate(formData);
 */
export function useSubmitClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClubPendingSubmission) => submitClubPending(data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["stats"] });
      }
    },
  });
}
