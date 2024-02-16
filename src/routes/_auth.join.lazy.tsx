import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { signup } from "@/api/services/auth";
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

    const { mutate, isPending } = useMutation({
      mutationFn: signup,
      onSuccess() {
        navigate({
          to: "/login",
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
                Register to your account
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
