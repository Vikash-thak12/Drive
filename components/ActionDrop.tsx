/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { actionsDropdownItems } from "@/constants"
import { constructDownloadUrl } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Models } from "node-appwrite"
import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { renameFile, updateFileUsers } from "@/lib/actions/file.actions"
import { usePathname } from "next/navigation"
import { FileDetails, ShareInput } from "./ActionModalContent"


interface ActionType {
    label: string;
    icon: string;
    value: string;
}



const ActionDrop = ({ file }: { file: Models.Document }) => {

    const [isModelOpen, setIsModelOpen] = useState(false)
    const [isDropdownOpen, setIsDropDownOpen] = useState(false)
    const [action, setAction] = useState<ActionType | null>(null)
    const [name, setName] = useState(file.name)
    const [isLoading, setIsLoading] = useState(false)
    const [emails, setEmails] = useState<string[]>([])

    const path = usePathname();

    console.log("The file of Action:", file)


    // This one is for cancel whatever is going on cancle button
    const closeAllModals = () => {
        setIsModelOpen(false)
        setIsDropDownOpen(false)
        setAction(null)
        setName(file.name)
        // setEmail later will be done 
    }

    // This will trigger when submit button is clicked to perform necesary action
    const handleAction = async () => {
        if(!action) return; 
        setIsLoading(true)

        let success = false;
        const actions = {
            rename: () => renameFile({fileId: file.$id, name, extension: file.extension, path}),
            share: () => updateFileUsers({fileId: file.$id, emails, path}),
            delete: () => console.log("delete")
        };

        success = await actions[action.value as keyof typeof actions]()
        if(success) closeAllModals()
        setIsLoading(false)
    }

    const handleRemove = async (email: string) => {
        const updateEmails = emails.filter((e) => e !== email)  // it will remove the selected email 
        const success = await updateFileUsers({ fileId: file.$id, emails: updateEmails, path})  // here this function is updated and the upper email is removed from the updateFileusers function 
        if(success) setEmails(updateEmails)  // then the selected email will be omit out from the emails usestate
        closeAllModals();
    }

    const renderDialogContent = () => {
        if (!action) return null;
        const { label, value } = action;
        return (
            <DialogContent className="shad-dialog button">
                <DialogHeader className="flex flex-col gap-3">
                    <DialogTitle className="text-center capitalize text-light-100">{label}</DialogTitle>
                    {
                        value === "rename" && <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    }
                    {
                        value === "details" && <FileDetails file={file} />
                    }
                    {
                        value === "share" && <ShareInput file={file} onInputChange={setEmails} onRemove={handleRemove}  />
                    }
                </DialogHeader>
                {
                    ['rename', "share", 'delete'].includes(value) && (
                        <DialogFooter className="flex flex-col gap-3 md:flex-row">
                            <Button onClick={closeAllModals}>
                                Cancel
                            </Button>
                            <Button onClick={handleAction}>
                                {isLoading ? (
                                    <Image src={"/assets/icons/loader.svg"} alt="Loader" width={24} height={24} className="animate-spin" />
                                ) : (
                                    <p className="capitalize">
                                        {value}
                                    </p>
                                )}
                            </Button>
                        </DialogFooter>
                    )
                }
            </DialogContent>
        )
    }

    return (
        <Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropDownOpen}>
                <DropdownMenuTrigger>
                    <Image src={"/assets/icons/dots.svg"} alt="Dot" width={34} height={34} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>{file.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {
                        actionsDropdownItems.map((item) => (
                            <DropdownMenuItem
                                key={item.value}
                                className="shad-drop-item"
                                onClick={() => {
                                    setAction(item)
                                    if (['rename', 'share', 'delete', 'details'].includes(item.value)) {
                                        setIsModelOpen(true)
                                    }
                                }}

                            >
                                {
                                    item.value === "download" ? (
                                        // note here i've changed the bucketFileId to bucketField
                                        <Link href={constructDownloadUrl(file.bucketField)} download={file.name} className="flex items-center gap-5">
                                            <Image src={item.icon} alt={file.value} width={30} height={30} />
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-5">
                                            <Image src={item.icon} alt={file.value} width={30} height={30} />
                                            {item.label}
                                        </div>
                                    )
                                }
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuContent>
            </DropdownMenu>

            {renderDialogContent()}
        </Dialog>

    )
}

export default ActionDrop
