import Image from 'next/image'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='w-full min-h-screen flex'>
            <section className='lg:flex flex-col w-1/2 p-10 bg-brand hidden'>
                <div className='flex flex-col mx-auto my-5 gap-5 px-10 max-w-[30rem]'>
                    <Image src={"/assets/icons/logo-full.svg"} alt='main logo' height={224} width={224} />
                    <div className='max-w-4xl'>
                        <h1 className='font-bold text-white text-3xl'>Manage your files the best way</h1>
                        <p className='font-semibold text-white'>This is the place where you can store all your documents..</p>
                    </div>
                    <div className='flex items-center justify-center'>
                        <Image src={"/assets/images/files.png"} alt='main logo' height={300} width={300}
                            className='hover:scale-105 hover:rotate-3 transition-all cursor-pointer'
                        />
                    </div>
                </div>
            </section>
            <section className='flex flex-1 flex-col bg-white p-5 lg:items-center lg:justify-center'>
                <div className='mb-16 lg:hidden'>
                    <Image src={"/assets/icons/logo-full-brand.svg"} alt='main logo' height={224} width={124} />
                </div>
                {children}
            </section>
        </div>
    )
}

export default layout
