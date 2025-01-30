"use client";
import { localStore, themeMode, truncAddress, updateUrlParams } from '@/lib/utils'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

export default function Header() {
    const [switchMode, setSwitchMode] = useState(false)
    const [triggerInputDrop, setTriggerForInputDrpDown] = useState(false)
    const navLinks = [
        {
            link: "/new-pair",
            linkText: "New pair"
        },
        {
            link: "/",
            linkText: "Trending"
        },
        {
            link: "#",
            linkText: "Discover"
        },
        {
            link: "#",
            linkText: "Holding"
        },
        {
            link: "#",
            linkText: "Follow"
        },
    ]

    const selectNetwork = [
        {
            img: "/static/solana.webp",
            ntwk: "sol"
        },
        {
            img: "/static/ether.webp",
            ntwk: "eth"
        },
        {
            img: "/static/base.webp",
            ntwk: "base"
        },
        {
            img: "/static/bsc.png",
            ntwk: "bsc"
        },
        {
            img: "/static/tron.webp",
            ntwk: "tron"
        },
        {
            img: "/static/blast.webp",
            ntwk: "blast"
        }
    ]


    const language = [
        {
            lang: "English"
        },
        {
            lang: "简体中文"
        },
        {
            lang: "繁體中文"
        },
        {
            lang: "한국어"
        },
    ]



    useEffect(() => {
        themeMode().default()
        setSwitchMode(themeMode().getFromStore() == "dark")

        updateUrlParams({chain: localStore("network") || "eth"})
    }, [])

  

    return (
        <div className="">
            <div className='md:px-[1.3rem] px-[.5rem] h-[56px] flex items-center gap-5 justify-between w-full'>
                <div className="flex items-center gap-5">
                    <div className="">
                        <Image src="/logo_light.svg" width={120} height={120} alt='logo light' className='dark:hidden md:min-w-[170px] min-w-[100px]' />
                        <Image src="/logo_black.png" width={120} height={120} alt='logo dark' className='dark:block hidden md:min-w-[170px] min-w-[100px]' />
                    </div>
                    <ul className='md:flex gap-3 hidden overflow-hidden'>
                        {
                            navLinks.map((_, i) => (
                                <li key={i} className='font-[500] text-accent-1 text-[14px] whitespace-nowrap'>
                                    <a href={_.link} className='h-full w-full '>{_.linkText}</a>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                <div className="relative max-w-[440px] w-full md:flex mx-[24px] hidden">
                    <div className="w-full relative h-[40px] rounded-lg overflow-hidden hover:border-inherit border border-transparent">
                        <div className="absolute z-[2]  top-0 h-[40px] left-[4px] flex items-center justify-center text-accent-4  text-aux-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.25rem" height="1.25rem" fill="currentColor" viewBox="0 0 20 20"><path d="M9.213 1.988a7.14 7.14 0 017.135 7.234c-.035 3.922-3.28 7.111-7.203 7.082-3.985-.03-7.181-3.276-7.14-7.25.042-3.933 3.253-7.081 7.208-7.066zm-.058 12.61a5.473 5.473 0 005.508-5.412c.04-3.025-2.465-5.536-5.51-5.524-3.007.012-5.45 2.467-5.45 5.476a5.455 5.455 0 005.452 5.46z"></path><path d="M16.666 17.795l-1.24-1.24a.75.75 0 010-1.056l.055-.055a.749.749 0 011.056 0l1.24 1.24a.75.75 0 010 1.057l-.054.054a.75.75 0 01-1.057 0z"></path></svg>
                        </div>
                        <input type="text" onFocus={() => setTriggerForInputDrpDown(true)} onBlur={() => setTriggerForInputDrpDown(false)} className='w-full h-full pl-8 placeholder:opacity-50 outline-none text-xs bg-accent-2' placeholder='Search token/contract/wallet' />
                        <div className="h-[40px] flex justify-center items-center  absolute right-0 top-0 z-[2]">
                            <div className="flex h-[1.25rem] bg-accent-3 rounded-[4px] justify-center items-center px-1 text-aux-1 text-[12px] whitespace-nowrap">Ctrl alt K</div>
                        </div>
                    </div>

                    {/* drop down */}
                    {!!triggerInputDrop && <div className="absolute w-full bg-accent-2 rounded-md left-0 top-[50px] p-3 h-[400px] overflow-y-auto scroll-smooth">
                        <div className="text-sm">Trending 24h</div>

                        <div className="mt-3 space-y-4 ">
                            {
                                Array(10).fill(1).map((_, i) => (
                                    <a key={i} href='/eth/token/18765' role='button' className="flex items-center justify-between p-2 hover:bg-accent-3 rounded-lg">
                                        <div className="flex gap-2">
                                            <button>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="#AEB2BD" viewBox="0 0 16 16"><g clipPath="url(#clip0_6939_489)"><path fillRule="evenodd" clipRule="evenodd" d="M6.421.99a1.754 1.754 0 013.158 0l1.587 3.127 3.352.603c1.414.254 1.976 2.051.975 3.121l-2.37 2.536.484 3.5c.204 1.477-1.267 2.587-2.554 1.93L8 14.245l-3.053 1.56c-1.287.658-2.758-.452-2.554-1.929l.484-3.5L.507 7.84c-1-1.07-.439-2.867.975-3.121l3.352-.603L6.421.99z"></path></g><defs><clipPath id="clip0_6939_489"><rect width="16" height="16"></rect></clipPath></defs></svg>
                                            </button>

                                            <div className="flex items-center gap-2">
                                                <div className="rounded-full border w-fit relative">
                                                    <Image src={"/static/3717.png"} className='w-[35px] h-[35px]' width={35} height={35} alt='' />
                                                    <Image src={"/static/ether.webp"} className='w-[15px] h-[15px] absolute bottom-0 right-0' width={15} height={15} alt='' />
                                                </div>

                                                <div className="">
                                                    <div className="max-w-[13rem] text-ellipsis overflow-hidden whitespace-nowrap text-[18px] font-[600] uppercase leading-[20px]">Ether</div>
                                                    <a href="" className='text-[13px] underline text-accent-1'>{truncAddress("0x1i48j8hned98")}</a>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="max-w-[13rem] text-ellipsis overflow-hidden whitespace-nowrap text-[18px] font-[600] uppercase leading-[20px]">$101.5k</div>
                                            <div className="text-[13px] text-[rgb(223,72,76)]/80">-5.98%</div>
                                        </div>
                                    </a>
                                ))
                            }
                        </div>
                    </div>}
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex gap-2 md:pr-[100px] items-center">
                        <Select defaultValue={localStore("network") || selectNetwork[1].ntwk} onValueChange={(v) => updateUrlParams({ chain: v.toLowerCase() })}>
                            <SelectTrigger className="md:w-[130px] w-[80px] p-0 md:bg-accent-2 rounded-xl border-none outline-none focus:ring-0">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    selectNetwork.map(({ img, ntwk }, i) => (
                                        <SelectItem value={ntwk} key={i}>
                                            <div className="flex items-center gap-1 uppercase">
                                                <Image src={img} alt={ntwk} className='w-[18px] h-[18px]' width={10} height={10} />
                                                {ntwk}
                                            </div>
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>

                        {/* display on mobile -search */}
                        <Dialog>
                            <DialogTrigger>
                                <div className='md:hidden'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M7.5 2.8a4.7 4.7 0 100 9.4 4.7 4.7 0 000-9.4zM1.2 7.5a6.3 6.3 0 1112.6 0 6.3 6.3 0 01-12.6 0z"></path><path fillRule="evenodd" clipRule="evenodd" d="M10.934 10.934a.8.8 0 011.132 0l3 3a.8.8 0 11-1.132 1.132l-3-3a.8.8 0 010-1.132z"></path></svg>
                                </div>
                            </DialogTrigger>
                            <DialogContent className='h-full bg-[#f4f4f5] w-full p-2 overflow-y-scroll'>
                                <DialogHeader>
                                    <DialogTitle className='text-left absolute top-4'>Search</DialogTitle>
                                </DialogHeader>
                                <div className='pt-8'>
                                    <div className="w-full relative h-[40px] rounded-lg overflow-hidden ">
                                        <div className="absolute z-[2]  top-0 h-[40px] left-[4px] flex items-center justify-center text-accent-search">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.25rem" height="1.25rem" fill="#AEB2BD" viewBox="0 0 20 20"><path d="M9.213 1.988a7.14 7.14 0 017.135 7.234c-.035 3.922-3.28 7.111-7.203 7.082-3.985-.03-7.181-3.276-7.14-7.25.042-3.933 3.253-7.081 7.208-7.066zm-.058 12.61a5.473 5.473 0 005.508-5.412c.04-3.025-2.465-5.536-5.51-5.524-3.007.012-5.45 2.467-5.45 5.476a5.455 5.455 0 005.452 5.46z"></path><path d="M16.666 17.795l-1.24-1.24a.75.75 0 010-1.056l.055-.055a.749.749 0 011.056 0l1.24 1.24a.75.75 0 010 1.057l-.054.054a.75.75 0 01-1.057 0z"></path></svg>
                                        </div>
                                        <input type="text" className='w-full h-full pl-8 placeholder:opacity-50 outline-none text-xs' placeholder='Search token/contract/wallet' />
                                        <div className="h-[40px] flex justify-center items-center text-accent-4 absolute right-0 top-0 z-[2]">
                                            <div className="flex h-[1.25rem] bg-accent-3 rounded-[4px] justify-center items-center px-1 text-[#AEB2BD] text-[12px] whitespace-nowrap">Ctrl alt K</div>
                                        </div>
                                    </div>

                                    <div className=" w-full mt-5 rounded-md h-full overflow-y-auto scroll-smooth">
                                        <div className="text-sm w-full text-black">Trending 24h</div>

                                        <div className="mt-3 space-y-4">
                                            {
                                                Array(10).fill(1).map((_, i) => (
                                                    <a key={i} href='/eth/token/18765' role='button' className="flex items-center justify-between p-2 hover:bg-accent-3 rounded-lg">
                                                        <div className="flex gap-2">
                                                            <button>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="#AEB2BD" viewBox="0 0 16 16"><g clipPath="url(#clip0_6939_489)"><path fillRule="evenodd" clipRule="evenodd" d="M6.421.99a1.754 1.754 0 013.158 0l1.587 3.127 3.352.603c1.414.254 1.976 2.051.975 3.121l-2.37 2.536.484 3.5c.204 1.477-1.267 2.587-2.554 1.93L8 14.245l-3.053 1.56c-1.287.658-2.758-.452-2.554-1.929l.484-3.5L.507 7.84c-1-1.07-.439-2.867.975-3.121l3.352-.603L6.421.99z"></path></g><defs><clipPath id="clip0_6939_489"><rect width="16" height="16"></rect></clipPath></defs></svg>
                                                            </button>

                                                            <div className="flex items-center gap-2">
                                                                <div className="rounded-full border w-fit relative">
                                                                    <Image src={"/static/3717.png"} className='w-[35px] h-[35px]' width={35} height={35} alt='' />
                                                                    <Image src={"/static/ether.webp"} className='w-[15px] h-[15px] absolute bottom-0 right-0' width={15} height={15} alt='' />
                                                                </div>

                                                                <div className="">
                                                                    <div className="max-w-[13rem] text-ellipsis overflow-hidden whitespace-nowrap text-[14px] font-[600] uppercase leading-[20px]">Ether</div>
                                                                    <a href="" className='text-[12px] underline text-accent-1'>{truncAddress("0x1i48j8hned98")}</a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <div className="max-w-[13rem] text-ellipsis overflow-hidden whitespace-nowrap text-[14px] font-[600] uppercase leading-[20px]">$101.5k</div>
                                                            <div className="text-[13px] text-[rgb(223,72,76)]/80">-5.98%</div>
                                                        </div>
                                                    </a>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div className='hover:bg-accent-2 duration-150 h-[35px] w-[35px] flex justify-center items-center rounded-md text-accent-search'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" className='text-accent-4' viewBox="0 0 20 20">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.652 2.05a2.75 2.75 0 012.696 0l4.977 2.8a2.75 2.75 0 011.402 2.397v5.51a2.75 2.75 0 01-1.402 2.397l-4.977 2.8a2.75 2.75 0 01-2.696 0l-4.978-2.8a2.75 2.75 0 01-1.402-2.397v-5.51c0-.994.536-1.91 1.402-2.397l4.978-2.8zm1.96 1.308a1.25 1.25 0 00-1.225 0l-4.977 2.8a1.25 1.25 0 00-.638 1.089v5.51c0 .451.244.868.638 1.09l4.977 2.799c.38.214.845.214 1.226 0l4.977-2.8a1.25 1.25 0 00.637-1.09v-5.51a1.25 1.25 0 00-.637-1.089l-4.977-2.8z"></path>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10 8.133a1.866 1.866 0 100 3.733 1.866 1.866 0 000-3.733zM6.634 9.999a3.366 3.366 0 116.733 0 3.366 3.366 0 01-6.733 0z"></path>
                                    </svg>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='w-[250px] space-y-1'>
                                <DropdownMenuItem>
                                    <div className="flex justify-between w-full items-center">
                                        <div className="text-xs">Alert Settings</div>
                                        <div className="rotate-[-90deg] text-accent-search">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" fill="currentColor" className='' viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M2.273 5.675a.933.933 0 011.32 0l4.674 4.674 4.673-4.674a.933.933 0 011.32 1.32L8.267 12.99 2.273 6.995a.933.933 0 010-1.32z"></path></svg>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-xs">Language</div>
                                        <div className="">
                                            <Select>
                                                <SelectTrigger className="w-[70px] text-xs bg-[#dbdee6] dark:bg-[#393c43] p-1 py-0 h-[25px] rounded-md border-none">
                                                    <SelectValue placeholder="English" />
                                                </SelectTrigger>
                                                <SelectContent className='bg-accent-3'>
                                                    {
                                                        language.map(({ lang }, i) => (
                                                            <SelectItem value={lang} key={i}>
                                                                <div className="flex items-center gap-1">
                                                                    {lang}
                                                                </div>
                                                            </SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </DropdownMenuItem>

                                <div className='px-2 mt-2'>
                                    <div className="flex w-full justify-between">
                                        <div className="text-xs">Dark Mode</div>
                                        <div className="">
                                            <Switch
                                                defaultChecked={switchMode}
                                                onCheckedChange={() => {
                                                    const s = themeMode().switch()
                                                    setSwitchMode(s)
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <button className='md:px-4 px-2 py-[0.4rem] rounded-md bg-accent-4 text-xs font-[600] text-white dark:text-black'>Connect</button>
                </div>
            </div>
            <div className="bg-accent-3 border-t w-full overflow-x-auto">
                <ul className='md:hidden gap-3 flex py-2 px-5'>
                    {
                        navLinks.map((_, i) => (
                            <li key={i} className='font-[500] text-accent-1 text-[14px] whitespace-nowrap'>
                                <a href={_.link} className='h-full w-full '>{_.linkText}</a>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}
