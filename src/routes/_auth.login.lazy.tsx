import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { signIn } from "@/api/services/auth";
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
import { MISC_CONFIG } from "@/constants/misc";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const Route = createLazyFileRoute("/_auth/login")({
  component: function HomePage() {
    const form = useForm<LoginSchema>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    });

    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
      mutationFn: signIn,
      onSuccess() {
        navigate({
          to: "/dashboard/boards",
        });
      },
    });

    const loginAsGuest = () => {
      mutate({
        email: MISC_CONFIG.GUEST.email,
        password: MISC_CONFIG.GUEST.password,
      });
    };

    return (
      <>
        <Helmet>
          <title>Login</title>
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
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm md:max-w-md">
              <Form {...form}>
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit((values) => {
                    return mutate(values);
                  })}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            autoFocus
                            type="email"
                            {...field}
                            disabled={isPending}
                          />
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
                          <Input
                            type="password"
                            {...field}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isPending} className="w-full">
                    Submit
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={loginAsGuest}
                    disabled={isPending}
                  >
                    Login as guest
                  </Button>
                </form>
              </Form>

              <p className="mt-10 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/join"
                  className="font-medium leading-6 text-primary hover:text-primary/90"
                >
                  Create a new one
                </Link>
              </p>
            </div>
          </div>
        </main>
      </>
    );
  },
});
