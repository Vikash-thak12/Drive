/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Dialog } from "@/components/ui/dialog"
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


interface ActionType {
    label: string;
    icon: string;
    value: string;
}



const ActionDrop = ({ file }: { file: Models.Document }) => {

    const [isModelOpen, setIsModelOpen] = useState(false)
    const [isDropdownOpen, setIsDropDownOpen] = useState(false)
    const [action, setAction] = useState<ActionType | null>(null)

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
                                        <Link href={constructDownloadUrl(file.bucketFileId)} className="flex items-center gap-5">
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

        </Dialog>

    )
}

export default ActionDrop
