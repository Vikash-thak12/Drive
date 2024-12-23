/* eslint-disable @typescript-eslint/no-unused-vars */
import Sort from '@/components/Sort';
import React from 'react'

interface SearchParamProps {
  params: { type: string }; // Accessing type directly from params
  // searchParams?: { [key: string]: string | string[] | undefined };
}

const DynamicPage = ({ params }: SearchParamProps) => {
  const { type } = params;

  return (
    <div className='sort-container'>
      <section className='w-full'>
        <h1 className='font-bold text-3xl capitalize'>{type}</h1>
        <div className='total-size-section'>
          <p>Total: <span className='font-bold'>12 KB</span></p>
          <div className='sort-container'>
              <p>Sort By: </p>
              <Sort />
          </div>
        </div>
      </section>

      {/* Render the filex`s  */}
    </div>
  )
}

export default DynamicPage
