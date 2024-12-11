'use server'
import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";

const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", email)]
    )

    // console.log("The user is", result);

    return result.total > 0 ? result.documents[0] : null;
}

export const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient();
    try {
        const session = await account.createEmailToken(ID.unique(), email);
        // Below all detials that session have 
        // '$id': '675952f6b0d3a874e080',
        // '$createdAt': '2024-12-11T08:53:10.725+00:00',
        // userId: '67594e20003cf6e90a19',
        // secret: '888953',
        // expire: '2024-12-11T09:08:10.724+00:00',
        // phrase: ''
        return session.userId; 
    } catch (error) {
        console.log("SendEmailOtp Error", error)
    }
}

export const createAccount = async ({ fullName, email }: { fullName: string, email: string }) => {
    const existingUser = await getUserByEmail(email);  // if there is user the value will come else null will be ther in the existingUser
    const accountId = await sendEmailOTP({ email });   //

    if (!accountId) throw new Error("Failed to send an OTP");

    if (!existingUser) {
        const { databases } = await createAdminClient();
        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),  // will create random id like this ##6758a75b00109a799907
            {
                fullName,
                email,
                avatar: avatarPlaceholderUrl,
                accountId   // here this accountId is where otp is send 
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

export const getCurrentUser = async () => {
    try {
        const { databases, account} = await createSessionClient();
        const result = await account.get();
        const user = await databases.listDocuments(
            appwriteConfig.databaseId, 
            appwriteConfig.usersCollectionId,
            [Query.equal("accountId", result.$id)]
        )

        if(user.total <= 0) return null;
        return parseStringify(user.documents[0])
    } catch (error) {
        console.log("Error in getCurrentUser", error)
    }
}