'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/button'
import Image from 'next/image'

interface FileProps {
  ownerId: string, 
  accountId: string, 
  path: string, 
  className?: string,
}

const FileUpload = ({ ownerId, accountId, path, className}: FileProps) => {
  const [files, setFiles] = useState<File[]>([])


  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button className='uploader-button' type='button'>
        <Image src={"/assets/icons/upload.svg"} alt='Upload' width={24} height={24} />
        <p>Upload</p>
      </Button>
    </div>
  )
}

export default FileUpload
