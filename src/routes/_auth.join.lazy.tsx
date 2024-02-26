import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { signIn, signup } from "@/api/services/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { ToastIcon, toast } from "@/components/ui/sonner";

import CheckCircleIcon from "~icons/heroicons/check-circle-20-solid";
import ExclamationIcon from "~icons/heroicons/exclamation-triangle-solid";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { MISC_CONFIG } from "@/constants/misc";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type RegisterSchema = z.infer<typeof registerSchema>;

export const Route = createLazyFileRoute("/_auth/join")({
  component: function HomePage() {
    const form = useForm<RegisterSchema>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    });

    const navigate = useNavigate();
    const [parent] = useAutoAnimate();

    const { mutate, isPending, error } = useMutation({
      mutationFn: signup,
      onSuccess() {
        toast("Account Successfully Created", {
          icon: <ToastIcon icon={CheckCircleIcon} type="success" />,
          description: "Your account creation is complete.",
        });

        navigate({
          to: "/login",
        });
      },
    });

    const loginAsGuest = async () => {
      try {
        await signIn({
          ...MISC_CONFIG.GUEST,
        });
        navigate({
          to: "/dashboard/boards",
        });
      } catch {
        /* empty */
      }
    };

    return (
      <>
        <Helmet>
          <title>Register</title>
        </Helmet>

        <main className="flex h-full min-h-screen w-full overflow-y-auto">
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 lg:pt-20">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <Link to="/" aria-label="Go to homepage">
                <img
                  src="/images/icon-logo-light.svg"
                  className="mx-auto h-10 w-auto dark:hidden"
                />
                <img
                  src="/images/icon-logo-dark.svg"
                  className="mx-auto hidden h-10 w-auto dark:block"
                />
              </Link>

              <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight">
                Create a new account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm md:max-w-md">
              <Form {...form}>
                <form
                  ref={parent}
                  className="space-y-6"
                  onSubmit={form.handleSubmit((values) => {
                    return mutate(values);
                  })}
                >
                  {error ? (
                    <div
                      role="alert"
                      className="!mt-4 flex w-full gap-3 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-600 dark:border-rose-800/40 dark:bg-rose-800/10 dark:text-rose-300"
                    >
                      <div className="h-10 w-10 rounded-full bg-rose-100 p-2 dark:bg-yellow-50/5">
                        <ExclamationIcon className="size-6 shrink-0" />
                      </div>
                      <div>
                        <p>{error.message}</p>
                        <p>
                          Please try again. If the issue persists -{" "}
                          <Button
                            variant="link"
                            asChild
                            className="h-auto p-0"
                            onClick={loginAsGuest}
                          >
                            <span>Login as guest</span>
                          </Button>
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input autoFocus type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isPending} className="w-full">
                    Submit
                  </Button>
                </form>
              </Form>

              <p className="mt-10 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium leading-6 text-primary hover:text-primary/90"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </main>
      </>
    );
  },
});
