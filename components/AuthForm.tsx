/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const formSchema = z.object({
    username: z.string().min(2).max(50),
})


const AuthForm = ({ type }: { type: "sign-up" | "sign-in" }) => {

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }


    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
                    <h1 className="form-title">
                        {type === "sign-in" ? "Sign-In" : "Sign-Up"}
                    </h1>
                    {type == "sign-up" && (
                        <FormField
                            control={form.control}
                            name="fullname"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="shad-form-item">
                                        <FormLabel className="shad-form-label">Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your fullname" className="shad-input" {...field} />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    )}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className="shad-form-item">
                                    <FormLabel className="shad-form-label">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your Email" className="shad-input" {...field} />
                                    </FormControl>
                                </div>
                                <FormMessage className="shad-form-message" />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                    <div className="flex items-center justify-center">
                        {type == "sign-in" ? (
                            <p>Didn&apos;t have an Account</p>
                        ) : (
                            <p>Already have an Account.</p>
                        )}
                        <Link href={type == "sign-in" ? "/sign-up" : "/sign-in"} className="ml-2 text-brand">
                            {type == "sign-in" ? "Sign-Up" : "Sign-In"}
                        </Link>
                    </div>
                </form>
            </Form>

            {/* OTP Verification */}
        </>
    )
}

export default AuthForm
