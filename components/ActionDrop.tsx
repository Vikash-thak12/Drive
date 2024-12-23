/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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

    const renderDialogContent = () => {
        if(!action) return null;
        const { label, value} = action;
        return (
            <DialogContent className="shad-dialog button">
            <DialogHeader className="flex flex-col gap-3">
              <DialogTitle className="text-center capitalize text-light-100">{label}</DialogTitle>
              {
                value === "rename" && <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              }
            </DialogHeader>
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

            { renderDialogContent() }
        </Dialog>

    )
}

export default ActionDrop
