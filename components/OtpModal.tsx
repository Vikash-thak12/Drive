/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"


import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import Image from "next/image"
import React, { useState } from "react"
import { Button } from "./ui/button"
import { sendEmailOTP, verifySecret } from "@/lib/actions/user.action"
import { useRouter } from "next/navigation"



const OtpModal = ({ email, accountId }: { email: string, accountId: string }) => {

    const [isOpen, setIsOpen] = useState(true)
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // console.log("The accountId", accountId)
    // console.log("The email", email)

    const router = useRouter();


    // this function is for verifying the otp 
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            // Call API To Verify OTP
            const sessionId = await verifySecret({ accountId, password});
            if(sessionId) router.push("/")
        } catch (error) {
            console.log("Failed to verify OTP", error)
        }
        setIsLoading(false)
    }


    // Resending the otp in case didn't receive 
    const handleResetOtp = async () => {
        // Call API To resend OTP
        await sendEmailOTP({ email });
    }

    return (
        <>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
                <AlertDialogContent className="shad-alert-dialog">
                    <AlertDialogHeader className="relative flex justify-center">
                        <AlertDialogTitle className="h2 text-center">

                            Enter the OTP
                            <Image
                                src={"/assets/icons/close-dark.svg"}
                                alt="close"
                                width={32}
                                height={32}
                                onClick={() => setIsOpen(false)}
                                className="absolute -top-8 -right-2 md:-top-7 md:-right-5 cursor-pointer p-1 hover:bg-gray-100 rounded-full"
                            />

                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-light-100">
                            We&apos;have sent a code to <span className="text-brand ml-1">{email}</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* for otp boxes */}
                    <InputOTP maxLength={6} value={password} onChange={setPassword}>
                        <InputOTPGroup className="shad-otp">
                            <InputOTPSlot index={0} className="shad-otp-slot" />
                            <InputOTPSlot index={1} className="shad-otp-slot" />
                            <InputOTPSlot index={2} className="shad-otp-slot" />
                            <InputOTPSlot index={3} className="shad-otp-slot" />
                            <InputOTPSlot index={4} className="shad-otp-slot" />
                            <InputOTPSlot index={5} className="shad-otp-slot" />
                        </InputOTPGroup>
                    </InputOTP>

                    <AlertDialogFooter>
                        <div className="flex flex-col w-full gap-4">
                            <AlertDialogAction onClick={handleSubmit} className="shad-submit-btn h-12" type="button">
                                {
                                    isLoading ? (
                                        <Image src={"/assets/icons/loader.svg"} alt="loader" width={24} height={24} className="animate-spin" />
                                    ) : "Submit"
                                }
                            </AlertDialogAction>
                            <div className="flex items-center justify-center">
                                Did&apos;t get a code ?
                                <Button
                                    type="button"
                                    variant="link"
                                    className="text-brand"
                                    onClick={handleResetOtp}
                                >
                                    Click to resend
                                </Button>
                            </div>
                        </div>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    )
}

export default OtpModal
