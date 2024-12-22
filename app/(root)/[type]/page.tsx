/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

interface SearchParamProps {
  params: { type: string }; // Accessing type directly from params
  searchParams?: { [key: string]: string | string[] | undefined };
}

const DynamicPage = ({ params, searchParams }: SearchParamProps) => {
  const { type } = params;

  return (
    <section>
      <h1>{type}</h1>
    </section>
  )
}

export default DynamicPage
