import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { signIn } from "@/api/services/auth";
import { useNavigate } from "@tanstack/react-router";

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

    return (
      <main className="flex h-screen w-screen items-center justify-center p-6">
        <Form {...form}>
          <form
            className="w-full max-w-md space-y-6 rounded-md border p-6"
            onSubmit={form.handleSubmit((values) => {
              return mutate(values);
            })}
          >
            <div className="space-y-3">
              <img src="/images/icon-logo.svg" className="invert" />
              <h1 className="text-4xl font-bold tracking-tight">
                Login to your account
              </h1>
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
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
      </main>
    );
  },
});
