'use server'
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", email)]
    )

    return result.total > 0 ? result.documents[0] : null;
}

export const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient();
    try {
        const session = await account.createEmailToken(ID.unique(), email);
        return session.userId;
    } catch (error) {
        console.log("SendEmailOtp Error", error)
    }
}

export const createAccount = async ({ fullName, email }: { fullName: string, email: string }) => {
    const existingUser = await getUserByEmail(email);
    const accountId = await sendEmailOTP({ email });

    if (!accountId) throw new Error("Failed to send an OTP");

    if (!existingUser) {
        const { databases } = await createAdminClient();
        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                avatar: "https://imgs.search.brave.com/vSSOwNShrPqVG8xT5hBbfFXN2UTJPSOtNEguDzGTta8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yYXcu/Z2l0aHVidXNlcmNv/bnRlbnQuY29tL0Fz/aHdpbnZhbGVudG8v/Y2FydG9vbi1hdmF0/YXIvbWFzdGVyL2xp/Yi9pbWFnZXMvbWFs/ZS84Ni5wbmc",
                accountId
            }
        )
    }

    return parseStringify({ accountId });
}


export const verifySecret = async ({ accountId, password}: { accountId: string, password: string}) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createSession(accountId, password);
        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true, 
            sameSite: "strict",
            secure: true
        })

        return parseStringify({ sessionId: session.$id})
    } catch (error) {
        console.log("Error verifying otp", error)
    }
}