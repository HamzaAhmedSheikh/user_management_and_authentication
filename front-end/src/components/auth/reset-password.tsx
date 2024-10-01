"use client"
import {VerifyEmailSchema} from "@/src/schemas/userschema";
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
import 'react-phone-input-2/lib/style.css';
import { redirect, useRouter } from "next/navigation";

function ResetPassword() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("")
    const { toast } = useToast();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof VerifyEmailSchema>>({
        resolver: zodResolver(VerifyEmailSchema),
        defaultValues: {
            email: "",
        },
    });
    
    const onsubmit = (values: z.infer<typeof VerifyEmailSchema>) => {
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
                        title: "OTP sent Successfully",
                        description: "OTP has been sent to your phone number",
                    })
                    router.replace('/auth/update-password')
                  }
            });
        });
    }
    
    return (
        <CardWrapper 
        headerLabel="Reset Password"
        >
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
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
                    <Button disabled={isPending} type="submit" className="w-full">
                        Send OTP
                    </Button>
                    <FormSuccess message={success} />
                    <FormError message={error} />
                </form>
             
            </FormProvider>
        </CardWrapper>
    )
}

export default ResetPassword;