"use client"
import {RecoverPasswordSchema} from "@/src/schemas/userschema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "../ui/use-toast";
import { useState, useTransition } from "react";
import { resetpassword } from "@/src/actions/recover-password";
import { CardWrapper } from "./card-wrapper";
import { Button } from "../ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";


function ResetPassword() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("")
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof RecoverPasswordSchema>>({
        resolver: zodResolver(RecoverPasswordSchema),
        defaultValues: {
            email: "",
        },
    });
    
    const onSubmit = (values: z.infer<typeof RecoverPasswordSchema>) => {
        setError("");
        setSuccess("");
        
        startTransition(() => {
            resetpassword(values).then((data) => {
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
                      title: "Password Reset Success",
                      description: "Please Check Your Email!",
                    })
                  }
            });
        });
    }
    
    return (
        <CardWrapper 
        headerLabel="Reset Password"
        >
            <FormProvider {...form}>
             
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
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
                        </>
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success}  />
                    <Button disabled={isPending} type="submit" className="w-full">
                        {"Reset Password"}
                    </Button>
                </form>
             
            </FormProvider>
        </CardWrapper>
    )
}

export default ResetPassword;