import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitClubPending } from "@/lib/submissions";
import type { ClubPendingSubmission } from "@/lib/directus-types";

interface SubmitClubVariables {
  data: ClubPendingSubmission;
  turnstileToken: string;
}

/**
 * Mutation hook for submitting a new club to the moderation queue.
 *
 * Usage:
 *   const { mutate, isPending, data } = useSubmitClub();
 *   mutate({ data: formData, turnstileToken });
 */
export function useSubmitClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, turnstileToken }: SubmitClubVariables) =>
      submitClubPending(data, turnstileToken),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["stats"] });
      }
    },
  });
}
