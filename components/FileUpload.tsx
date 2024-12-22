'use client'
import { useCallback, useState } from 'react'
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
    setFiles(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button className='uploader-button' type='button'>
        <Image src={"/assets/icons/upload.svg"} alt='Upload' width={24} height={24} />
        <p>Upload</p>
      </Button>
      {
        files.length > 0 && <ul className='uploader-preview-list'>
          <h4 className='h4 text-light-100'>Uploading</h4>
          {
            files.map((file, index) => {
              const { type, extension } = getFileType(file.name)
              // console.log("the file name is", file.name)
              // the file name is Screenshot (29).png
              return (
                <li key={`${file.name}-${index}`} className='uploader-preview-item'>
                  <div>
                    <Thumbnail
                      type={type}
                      extension={extension}
                      url={convertFileToUrl(file)}
                    />
                  </div>
                </li>
              )
            })
          }
        </ul>
      }
    </div>
  )
}

export default FileUpload
