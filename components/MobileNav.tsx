'use client'
import Image from 'next/image'
import React, { useState } from 'react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { navItems } from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import FileUpload from './FileUpload'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { signOutUser } from '@/lib/actions/user.action'

interface Props {
  fullName: string,
  email: string,
  avatar: string
}


const MobileNav = ({ fullName, email, avatar }: Props) => {

  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname();


  return (
    <header className='px-5 py-2 flex items-center justify-between md:hidden'>
      <Image src={"/assets/icons/logo-full-brand.svg"} alt='mobileLogo' width={120} height={60} />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Image src={"/assets/icons/menu.svg"} alt='mobileLogo' width={32} height={32} className='cursor-pointer' />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <div className='flex items-center gap-2'>
                <Image src={avatar} alt='logo' width={40} height={40} className='rounded-full' />
                <div className='flex flex-col'>
                  <p className='subtitle-2 capitalize'>{fullName}</p>
                  <p className='caption'>{email}</p>
                </div>
              </div>
            </SheetTitle>
            <Separator />
            <div>
              <nav className='mt-5 flex-1 text-brand'>
                <ul className='flex flex-col gap-4 flex-1'>
                  {navItems.map(({ name, url, icon }) => (
                    <Link href={url} key={name}>
                      <li className={cn("flex items-center px-5 py-3 rounded-full gap-4", (pathname == url) && "bg-brand text-white shadow-drop-2")}>
                        <Image src={icon} alt='logo' width={32} height={32} className={cn("nav-icon", (pathname == url) && 'nav-icon-active')} />
                        <p>{name}</p>
                      </li>
                    </Link>
                  ))}
                </ul>
              </nav>
            </div>

            <Separator />


            <FileUpload />
            <div>
              {/* TODO: Logout Functionality to be implemented here  */}
              <Button className='mobile-sign-out-button mt-5' type='submit' onClick={async () => await signOutUser()}>
                <Image src={"/assets/icons/logout.svg"} alt='Logout' width={24} height={24} className='w-6' />
                Logout
              </Button>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>

    </header>
  )
}

export default MobileNav
