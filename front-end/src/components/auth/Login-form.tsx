"use client";
import { signIn } from "next-auth/react";
import * as z from "zod";
import { Control, useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/src/schemas/userschema";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { CardWrapper } from "@/src/components/auth/card-wrapper";
import { Button } from "@/src/components/ui/button";
import { FormError } from "@/src/components/form-error";
import { FormSuccess } from "@/src/components/form-success";
import { login } from "@/src/actions/login";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { googleAuthenticate } from "@/src/actions/index"
import { useFormState } from "react-dom"

// import SingInButton from "@/src/components/google/siginInButton";

import Link from "next/link";

export const LoginForm = () => {
  const searchParams = useSearchParams();

  // Get all the query params
  const redirect_uri = searchParams.get("redirect_uri");
  const client_id = searchParams.get("client_id");
  const response_type = searchParams.get("response_type");
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const queryParams = `?redirect_uri=${redirect_uri}` + `&state=${state}` + `&response_type=${response_type}` + `&client_id=${client_id}` + `&code=${code}`

  let callbackUrl: string | null = null

  if (redirect_uri) {
    callbackUrl = `/dashboard${queryParams}`
  }

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter()
  const { toast } = useToast()
  const [errorMsgGoogle, dispatchGoogle] = useFormState(googleAuthenticate, undefined)

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },    
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");    

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
            toast({
              title: "Login Failed",
              description: data.message ? data.message : "Request Failed, Try Again",
              action: (
                <ToastAction altText="Dismiss">Dismiss</ToastAction>
               )
            })
            form.reset();
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
            toast({
              title: "Login Success",
              description: data.message ? data.message : "Welcome to Panaversity",
              action: (
               <ToastAction altText="Close">Close</ToastAction>
              ),
            })
            router.push(callbackUrl || DEFAULT_LOGIN_REDIRECT );
          }
        })
    });
  };

  return (
    <CardWrapper
      headerLabel="Login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}  className="space-y-6 ">
          <div className="space-y-4">
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="example@gmail.com"
                          type="email"
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
                          {...field}
                          disabled={isPending}
                          placeholder="******"
                          type="password"
                        />
                      </FormControl>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/auth/reset-password">Forgot password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success}  />
          <Button disabled={isPending} type="submit" className="w-full">
            {"Login"}
          </Button>         
      
          <Button
            size="sm"
            variant="link"
            asChild
            className="w-full"
          >
            <Link href="/register">Don't have an account? Register</Link>
          </Button>
        </form>
      </Form>

      
    </CardWrapper>
  );
};