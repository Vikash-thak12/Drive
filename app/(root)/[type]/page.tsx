/* eslint-disable @typescript-eslint/no-unused-vars */
import Card from '@/components/Card';
import Sort from '@/components/Sort';
import { getFiles } from '@/lib/actions/file.actions';
import { getFileTypesParams } from '@/lib/utils';
import { Models } from 'node-appwrite';
import React from 'react'

const DynamicPage = async ({ params, searchParams }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";
  const searchText = ((await searchParams)?.query as string) || ""; 
  const sort = ((await searchParams)?.sort as string) || "";


  // this is for different types like document, media, others, images
  const types = getFileTypesParams(type) as FileType[];

  const files = await getFiles({ types, searchText, sort });
  // console.log("the files are", files)

  return (
    <div className='mx-auto flex w-full max-w-7xl flex-col items-center gap-8'>
      <section className='w-full'>
        <h1 className='font-bold text-3xl capitalize'>{type}</h1>
        <div className='flex mt-2 flex-col justify-between sm:flex-row sm:items-center'>
          <p>Total: <span className='font-bold'>12 KB</span></p>
          <div className='sort-container'>
              <p>Sort By: </p>
              <Sort />
          </div>
        </div>
      </section>

      {/* Render the filex`s  */}
      {
        files.total > 0 ? (
          <section className='grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {
              files.documents.map((file: Models.Document) => {
                return (
                  <Card key={file.$id} file={file} />
                )
              })
            }
          </section>
        ) : (
          <p className='text-center text-light-200 mt-10'>No files found</p>
        )
      }
    </div>
  )
}

export default DynamicPage
