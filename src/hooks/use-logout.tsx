import { signout } from "@/api/services/auth";
import { useRouter } from "@tanstack/react-router";

export function useLogout() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: signout,
    onSettled() {
      router.invalidate();
      queryClient.clear();
      router.navigate({
        to: "/login",
      });
    },
  });

  return { logout, isPending };
}
