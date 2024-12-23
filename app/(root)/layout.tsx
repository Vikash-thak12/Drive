import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'
import Sidebar from '@/components/Sidebar'
import { Toaster } from '@/components/ui/toaster'
import { getCurrentUser } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation'
import React from 'react'

const layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  if(!currentUser) return redirect("/sign-in")

  return (
    <main className='flex h-screen'>
      <Sidebar {...currentUser} />
      <section className='flex flex-1 flex-col h-full'>
        <MobileNav {...currentUser} />
        <Header userId={currentUser.$id} accountId={currentUser.accountId} />
        <div className='h-full bg-light-400 flex-1 px-5 py-7 overflow-auto remove-scrollbar lg:mb-7 rounded-[30px] lg:mr-7'>
          {children}
        </div>
      </section>
      <Toaster />
    </main>
  )
}

export default layout
