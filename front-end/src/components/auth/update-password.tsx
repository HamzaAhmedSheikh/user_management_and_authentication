"use client"
import {UpdatePasswordSchema} from "@/src/schemas/userschema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "../ui/use-toast";
import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { CardWrapper } from "./card-wrapper";
import { updatepassword } from "@/src/actions/update-password";
import { redirect } from "next/navigation";

function UpdatePassword() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("")
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof UpdatePasswordSchema>>({
        resolver: zodResolver(UpdatePasswordSchema),
        defaultValues: {
            current_password: "",
            new_password: ""
        },
    });
    
    const onSubmit = (values: z.infer<typeof UpdatePasswordSchema>) => {
        setError("");
        setSuccess("");
        
        startTransition(() => {
            updatepassword(values).then((data) => {
                setError(data.error);
                setSuccess(data.success);
                if (data?.error) {
                    form.reset();
                    toast({
                      title: "Request Failed",
                      description: data?.error,
                      variant: "destructive",
                    })
                }
                if (data?.success) {
                    toast({
                      title: "Password updated Successfully",
                      description: "You have successfully updated your password",
                    })
                    redirect('/login')
                  }
            });
        });
    }
    
    return (
        <CardWrapper
        headerLabel="Update Password"
        >
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
                    <div className="space-y-4">
                        <>
                            <FormField
                                control={form.control}
                                name="current_password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Current Password</FormLabel>
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
                                name="new_password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>New Password</FormLabel>
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
                        </>
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success}  />
                    <Button disabled={isPending} type="submit" className="w-full">
                        {"Update Password"}
                    </Button>
                </form>
            </FormProvider>
        </CardWrapper>
    );
}

export default UpdatePassword;