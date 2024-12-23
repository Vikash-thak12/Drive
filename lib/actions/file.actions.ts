/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { createAdminClient } from "../appwrite"
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.action";

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
};

interface UploadProps {
    file: File,
    ownerId: string,
    accountId: string,
    path: string
}

export const uploadFile = async ({ file, ownerId, accountId, path }: UploadProps) => {
    const { storage, databases } = await createAdminClient();
    try {
        const inputFile = InputFile.fromBuffer(file, file.name)
        const bucketFile = await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            inputFile
        )

        const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId,
            accountId,
            users: [],
            bucketField: bucketFile.$id
        }

        const newFile = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            ID.unique(),
            fileDocument
        )
            .catch(async (error: unknown) => {
                await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id)
                handleError(error, "Failed to create file Document")
            })

        revalidatePath(path)
        return parseStringify(newFile)
    } catch (error) {
        handleError(error, "Failed to upload file");
    }
}



export const CreateQueries = async (currentUser: Models.Document) => {
    const queries = [
        Query.or([
            Query.equal("owner", [currentUser.$id]),
            Query.contains("users", [currentUser.email])
        ])
    ]

    return queries;
}


export const getFiles = async () => {
    const { databases } = await createAdminClient();
    try {
        const currentUser = await getCurrentUser();
        if(!currentUser) throw new Error("User not found");

        const queries = await CreateQueries(currentUser);
        const files = await databases.listDocuments(
            appwriteConfig.databaseId, 
            appwriteConfig.filesCollectionId, 
            queries
        )

        return parseStringify(files);
    } catch (error) {
        handleError(error, "Not able to find the files")
    }
}