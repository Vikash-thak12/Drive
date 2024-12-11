import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'
import Sidebar from '@/components/Sidebar'
import React from 'react'

const layout = ({ children}: { children: React.ReactNode}) => {
  return (
    <main className='flex h-screen'>
        <Sidebar />
      <section className='flex flex-1 flex-col h-full'>
        <MobileNav />
        <Header />
        <div className='h-full bg-light-400 flex-1 px-5 py-7 overflow-auto remove-scrollbar lg:mb-7 rounded-[30px] lg:mr-7'>
            {children}
        </div>
      </section>
    </main>
  )
}

export default layout
