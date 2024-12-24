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

interface RenameFileProps {
    fileId: string, 
    name: string, 
    extension: string, 
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



export const CreateQueries = async (currentUser: Models.Document, types: string[], searchText: string, sort: string, limit?: number) => {
    const queries = [
        Query.or([
            Query.equal("owner", [currentUser.$id]),
            Query.contains("users", [currentUser.email])
        ])
    ]

    // this is for categoring the type like media, documents, others, images
    if(types.length > 0) queries.push(Query.equal("type", types))
    if(searchText) queries.push(Query.contains("name", searchText))  // used of getting the search item
    if(limit) queries.push(Query.limit(limit))  // used for setting the limit for a specific page 



    if(sort){
        const [sortBy, orderBy] = sort.split("-");
        queries.push(
            orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
        )
    }

    return queries;
}


export const getFiles = async ({ types = [], searchText="", sort="$createdAt-desc", limit}: GetFilesProps) => {
    const { databases } = await createAdminClient();
    try {
        const currentUser = await getCurrentUser();
        if(!currentUser) throw new Error("User not found");

        const queries = await CreateQueries(currentUser, types, searchText, sort, limit);
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


// this function is for renaming the file name 
export const renameFile = async ({ fileId, name, extension, path}: RenameFileProps) => {
    const { databases } = await createAdminClient();
    try {
        const newName = `${name}.${extension}`
        const updatedName = await databases.updateDocument(
            appwriteConfig.databaseId, 
            appwriteConfig.filesCollectionId, 
            fileId,
            {
                name: newName
            }
        )

        revalidatePath(path)
        return parseStringify(updatedName)
    } catch (error) {
        handleError(error, "Failed to rename file")
    }
}



// this one is for updating the file's users or we can say updating the emails in this file 
interface UpdateFileUserProps {
    fileId: string, 
    emails: string[],
    path: string
}

export const updateFileUsers = async ({ fileId, emails, path}: UpdateFileUserProps) => {
    const { databases } = await createAdminClient();
    try {
        const UpdateFile = await databases.updateDocument(
            appwriteConfig.databaseId, 
            appwriteConfig.filesCollectionId, 
            fileId,
            {
                users: emails
            }
        )

        revalidatePath(path)
        return parseStringify(UpdateFile)
    } catch (error) {
        handleError(error, "Failed to rename file")
    }
}



// this one is for deleting the file 
interface deleteFileProps {
    fileId: string, 
    buckedFileId: string,
    path: string
}
export const deleteFile = async ({ fileId, buckedFileId, path}: deleteFileProps) => {
    const { databases, storage } = await createAdminClient();
    try {
        const deleteFile = await databases.deleteDocument(
            appwriteConfig.databaseId, 
            appwriteConfig.filesCollectionId, 
            fileId,
        )

        if(deleteFile) await storage.deleteFile(appwriteConfig.bucketId, buckedFileId)

        revalidatePath(path)
        return parseStringify({ status: "success"})
    } catch (error) {
        handleError(error, "Failed to rename file")
    }
}