/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/button'
import Image from 'next/image'
import { convertFileToUrl, getFileType } from '@/lib/utils'
import Thumbnail from './Thumbnail'

interface FileProps {
  ownerId: string,
  accountId: string,
  path: string,
  className?: string,
}

const FileUpload = ({ ownerId, accountId, path, className }: FileProps) => {
  const [files, setFiles] = useState<File[]>([])


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, [])
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
