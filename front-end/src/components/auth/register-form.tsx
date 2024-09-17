"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastAction } from "@/src/components/ui/toast"
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { RegisterSchema } from "@/src/schemas/userschema";
import { Input } from "@/src/components/ui/input";
import { useRouter } from "next/navigation";
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
import { register } from "@/src/actions/register";
import { useToast } from "@/src/components/ui/use-toast"
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { affiliations } from "@/src/constants/affiliation";
import Link from "next/link";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast()
  const searchParams = useSearchParams();
  const router = useRouter();
  // Get all the query params
  const redirect_uri = searchParams.get("redirect_uri");
  const client_id = searchParams.get("client_id");
  const response_type = searchParams.get("response_type");
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const queryParams = `?redirect_uri=${redirect_uri}` + `&state=${state}` + `&response_type=${response_type}` + `&client_id=${client_id}` + `&code=${code}` 

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
        email: "",
        password: "",
        fullname: "",
        phone: "",
        affiliation: "None",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        if (data?.error) {
          // form.reset();
          toast({
            title: "Signup Failed",
            description: data?.error,
            variant: "destructive",
          })
        }
        if (data?.success) {
          toast({
            title: "Signup Success",
            description: "Please Login To Continue",
            action: (
              <Link href={redirect_uri ? `/login${queryParams}` : "/login"}><ToastAction altText="Login to Continue!">Login Now</ToastAction></Link> 
            ),
          })
          router.push("/login"); 
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="John Doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      placeholder="user@example.com"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <ReactPhoneInput
                      country={'pk'}
                      value={field.value}
                      onChange={(phone: string) => field.onChange(phone)}
                      disabled={isPending}
                      placeholder="+921234567890"
                      buttonStyle={{ backgroundColor: '#f9fafb' }}
                      inputStyle={{ width: '100%' }}
                      countryCodeEditable={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="affiliation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affiliation </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={
                            form.formState.errors.affiliation
                              ? 'border-red-500 focus-visible:ring-red-500'
                              : 'focus-visible:ring-custom-color focus:ring-custom-color'
                          }
                        >
                          <SelectValue placeholder="The Student’s affiliation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {affiliations.map((affiliation, index) => (
                          <SelectItem
                            className="focus:bg-custom-color focus:text-black focus:font-semibold"
                            key={index}
                            value={affiliation}
                          >
                            {affiliation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Create an account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};