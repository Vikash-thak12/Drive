import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/actions/user.action'
import React from 'react'

const layout = async ({ children}: { children: React.ReactNode}) => {
    const currentUser = await getCurrentUser()

  return (
    <main className='flex h-screen'>
        <Sidebar {...currentUser} />
      <section className='flex flex-1 flex-col h-full'>
        <MobileNav {...currentUser} />
        <Header />
        <div className='h-full bg-light-400 flex-1 px-5 py-7 overflow-auto remove-scrollbar lg:mb-7 rounded-[30px] lg:mr-7'>
            {children}
        </div>
      </section>
    </main>
  )
}

export default layout
