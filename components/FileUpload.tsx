/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/button'
import Image from 'next/image'
import { convertFileToUrl, getFileType } from '@/lib/utils'
import Thumbnail from './Thumbnail'
import { MAX_FILE_SIZE } from '@/constants'
import { useToast } from '@/hooks/use-toast'
import { uploadFile } from '@/lib/actions/file.actions'
import { usePathname } from 'next/navigation'

interface FileProps {
  ownerId: string,
  accountId: string,
  className?: string,
}

const FileUpload = ({ ownerId, accountId, className }: FileProps) => {
  const [files, setFiles] = useState<File[]>([])

  const { toast } = useToast();

  const path = usePathname();


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    const uploadPromise = await acceptedFiles.map( async (file) => {
      if(file.size > MAX_FILE_SIZE){
        // will return those files whose size is less than 50MB
        setFiles((prevFile) => prevFile.filter((f) => f.name !== file.name))

        return toast({
          description: (
            <p className='body-2 text-white'>
              <span className='font-semibold'>
                {file.name}
              </span> is too large. Max file size is 50MB.
            </p>
          ), className: "error-toast"
        })

      }


      // calling the uploadfile for uploading the actual files 
      return uploadFile({ file, ownerId, accountId, path}).then(
        (uploadFile) => {
          if(uploadFile) {
            setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name))
          }
        }
      )
    })

    await Promise.all(uploadPromise)

  }, [ownerId, accountId, path])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleRemoveFile = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, fileName: string) => {
    // Prevents the click event on the "Remove" icon from propagating to its parent elements.
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
  }

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button className='uploader-button' type='button'>
        <Image src={"/assets/icons/upload.svg"} alt='Upload' width={24} height={24} />
        <p>Upload</p>
      </Button>
      {
        files.length > 0 && (
          <ul className='uploader-preview-list'>
            <h4 className='h4 text-light-100'>Uploading</h4>
            {
              files.map((file, index) => {
                const { type, extension } = getFileType(file.name)
                // console.log("the file name is", file.name)
                // the file name is Screenshot (29).png
                return (
                  <li key={`${file.name}-${index}`} className='uploader-preview-item'>
                    <div className='flex items-center gap-5'>

                      <Thumbnail
                        type={type}
                        extension={extension}
                        url={convertFileToUrl(file)}
                      />

                      <div className='preview-item-name'>
                        {file.name}
                        <Image src={"/assets/icons/file-loader.gif"} alt='Uploading' width={100} height={100} />
                      </div>

                    </div>

                    <Image src={"/assets/icons/remove.svg"} alt='Remove' width={32} height={32} onClick={(e) => handleRemoveFile(e, file.name)} />
                  </li>
                )
              })
            }
          </ul>
        )
      }
    </div>
  )
}

export default FileUpload
