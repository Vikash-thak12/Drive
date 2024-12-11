'use client'
import { navItems } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface Props {
  fullName: string, 
  email: string, 
  avatar: string
}

const Sidebar = ({ fullName, email, avatar}: Props) => {

  const pathname = usePathname();
  return (
    <aside className='h-screen overflow-auto remove-scrollbar flex-col w-[90px] lg:w-[280px] xl:w-[325px] hidden md:flex px-5 py-7'>
      <Link href={"/"}>
        <Image src={"/assets/icons/logo-full-brand.svg"} alt='Main Logo' width={160} height={160} className='hidden lg:block h-auto' />
        <Image src={"/assets/icons/logo-brand.svg"} alt='Main Logo' width={160} height={160} className='lg:hidden' />
      </Link>

      <nav className='mt-5 flex-1 text-brand'>
        <ul className='flex flex-col gap-4 flex-1'>
          {navItems.map(({ name, url, icon }) => (
            <Link href={url} key={name}>
              <li className={cn("sidebar-nav-item hover:border", (pathname == url) && "bg-brand text-white shadow-drop-2")}>
                <Image src={icon} alt='logo' width={32} height={32} className={cn("nav-icon", (pathname == url) && 'nav-icon-active')} />
                <p className='hidden lg:block'>{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
      <Image src={"/assets/images/files-2.png"} alt='logo' width={300} height={300} />
      <div className='sidebar-user-info'>
        <Image src={avatar} alt='logo' width={40} height={40} className='rounded-full' />
        <div className='hidden lg:block'>
          <p className='font-semibold capitalize'>{fullName}</p>
          <p className='caption'>{email}</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
