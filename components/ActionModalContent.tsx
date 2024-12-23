import { Models } from "node-appwrite"
import Thumbnail from "./Thumbnail"
import FormattedDateTime from "./FormattedDateTime"
import { convertFileSize, formatDateTime } from "@/lib/utils"

const ImageThumbnail = ({ file }: { file: Models.Document}) => (
    <div className="file-details-thumbnail">
        <Thumbnail type={file.type} extension={file.extension} url={file.url} />
        <div className="flex flex-col">
            <p>{file.name}</p>
            <FormattedDateTime date={file.$createdAt} />
        </div>
    </div>
)

const DetailRow = ({ label, value }: {label: string, value: string}) => (
    <div className="flex">
        <p className="file-details-label">{label}</p>
        <p className="file-details-value">{value}</p>
    </div>
)

export const FileDetails = ({ file }: {file: Models.Document}) => {
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

