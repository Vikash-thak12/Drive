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
import { useState } from "react"
import Image from "next/image"
import { createAccount } from "@/lib/actions/user.action"
import OtpModal from "./OtpModal"


type FormType = "sign-up" | "sign-in";

const authformSchema = (formtype: FormType) => {
    return z.object({
        fullName: formtype == "sign-up" ? z.string().min(2).max(50) : z.string().optional(),
        email: z.string().email()
    })
}


const AuthForm = ({ type }: { type: FormType}) => {

    const [isLoading, setIsLoading] = useState(false)
    const [accountId, setAccountId] = useState(null)
    const [errorMessage, setErrorMessage] = useState("")

    // 1. Define your form.
    const formSchema = authformSchema(type)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
        setIsLoading(true);
        setErrorMessage("")
        try {
            const user = await createAccount({
                fullName: values.fullName || '',
                email: values.email
            })

            setAccountId(user.accountId);
            
        } catch (error) {
            setErrorMessage("Falied to create an Account")
        } finally {
            setIsLoading(false)
        }
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
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="shad-form-item">
                                        <FormLabel className="shad-form-label">Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your full Name" className="shad-input" {...field} />
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
                    <Button type="submit" className="form-submit-button" disabled={isLoading}>
                    {type == "sign-in" ? "Sign-In" : "Sign-Up"}
                    <p>
                        {isLoading && (
                            <Image src={"/assets/icons/loader.svg"} alt="Loader" width={24} height={24} className="ml-5 animate-spin" />
                        )}
                    </p>
                    </Button>
                    <div className="flex items-center justify-center">
                        {type == "sign-in" ? (
                            <p className="text-light-100">Didn&apos;t have an Account</p>
                        ) : (
                            <p className="text-light-100">Already have an Account.</p>
                        )}
                        <Link href={type == "sign-in" ? "/sign-up" : "/sign-in"} className="ml-2 text-brand">
                            {type == "sign-in" ? "Sign-Up" : "Sign-In"}
                        </Link>
                    </div>
                </form>
            </Form>

            {/* OTP Verification */}

            {true && <OtpModal />}
        </>
    )
}

export default AuthForm
