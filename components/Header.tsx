import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Search from './Search'
import FileUpload from './FileUpload'
import { signOutUser } from '@/lib/actions/user.action'

const Header = () => {
  return (
    <header className='hidden lg:flex items-center justify-between gap-5 p-4 md:px-16'>
      <Search />
      <div className='flex items-center justify-center min-w-fit gap-4'>
        <FileUpload />
        <form action={async () => {
          'use server'
          await signOutUser();
        }}>
          <Button className='sign-out-button' type='submit'>
            <Image src={"/assets/icons/logout.svg"} alt='Logout' width={24} height={24} className='w-6' />
          </Button>
        </form>
      </div>
    </header>
  )
}

export default Header
