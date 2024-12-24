/* eslint-disable @typescript-eslint/no-unused-vars */
import { Models } from "node-appwrite"
import Thumbnail from "./Thumbnail"
import FormattedDateTime from "./FormattedDateTime"
import { convertFileSize, formatDateTime } from "@/lib/utils"
import Image from "next/image"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

const ImageThumbnail = ({ file }: { file: Models.Document }) => (
    <div className="file-details-thumbnail">
        <Thumbnail type={file.type} extension={file.extension} url={file.url} />
        <div className="flex flex-col">
            <p>{file.name}</p>
            <FormattedDateTime date={file.$createdAt} />
        </div>
    </div>
)

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex">
        <p className="file-details-label">{label}</p>
        <p className="file-details-value">{value}</p>
    </div>
)

export const FileDetails = ({ file }: { file: Models.Document }) => {
    return (
        <>
            <ImageThumbnail file={file} />
            <DetailRow label="Format:" value={file.extension} />
            <DetailRow label="Size:" value={convertFileSize(file.size)} />
            <DetailRow label="Owner:" value={file.owner.fullName} />
            <DetailRow label="Last Edit:" value={formatDateTime(file.$updatedAt)} />
        </>
    )
}


interface ShareProps {
    file: Models.Document;
    onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
    onRemove: (email: string) => void;
}



// share input UI
export const ShareInput = ({ file, onInputChange, onRemove }: ShareProps) => (
    <>
        <ImageThumbnail file={file} />
        <div className="share-wrapper">
            <p>Share with your friends</p>
            <Input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => onInputChange(e.target.value.trim().split(","))}
            />
            <div className="mt-5">
                <div className="flex items-center justify-between">
                    <p>Shared with</p>
                    <p className="text-light-200">{file.users.length} users</p>
                </div>
                <ul>
                    {
                        file.users.map((email: string) => (
                            <li key={email}>
                                <p>{email}</p>
                                <Button onClick={() => onRemove(email)}>
                                    <Image src={"/assets/icons/remove.svg"} alt="Remove" width={24} height={24} />
                                </Button>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    </>
)