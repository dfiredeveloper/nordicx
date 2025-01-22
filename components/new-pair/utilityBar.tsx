'use client';
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu'
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


export default function UtilityBar({ setSwitch, switchTabs }) {
    const [activeTimeFrame, setTimeFrame] = useState("1m")
    const interval = [
        { interval: "1m" },
        { interval: "5m" },
        { interval: "1h" },
        { interval: "6h" },
        { interval: "24h" },
    ]
    return (
        <div className='md:px-[1.3rem] px-[.5rem] py-[1rem] flex flex-col md:flex-row justify-between items-center'>
            <div className="border md:hidden flex items-center divide-x rounded-xl overflow-hidden w-full ">
                {
                    interval.map(({ interval }, i) => (
                        <button key={i} onClick={() => setTimeFrame(interval)} className={`h-[28px] w-[28px] min-w-[48px] flex flex-1 items-center justify-center text-[13px] ${activeTimeFrame == interval ? "text-[#111111] bg-accent-3" : "text-[#AEB2BD]"}`}>{interval}</button>
                    ))
                }
            </div>
            <div className="md:flex items-center gap-5 hidden">
                {/* tabs */}
                <div className="flex items-center gap-2 ">
                    <button className={`font-[700] text-[15px] ${switchTabs == '1' ? "dark:text-[#f5f5f5] text-[#111111]" : 'dark:text-[#f5f5f5]/40 text-[#111111]/40'}`} onClick={() => setSwitch('1')}>Dashboard</button>
                    <button className={`font-[700] text-[15px] ${switchTabs == '2' ? "dark:text-[#f5f5f5] text-[#111111]" : 'dark:text-[#f5f5f5]/40 text-[#111111]/40'}`} onClick={() => setSwitch('2')}>New pair</button>
                </div>
                {/* request interval */}
                <div className="border flex items-center divide-x rounded-xl overflow-hidden">
                    {
                        interval.map(({ interval }, i) => (
                            <button key={i} onClick={() => setTimeFrame(interval)} className={`h-[28px] w-[28px] min-w-[48px] flex items-center justify-center text-[13px] ${activeTimeFrame == interval ? "text-[#111111] dark:text-white bg-accent-3" : "text-accent-aux-1"}`}>{interval}</button>
                        ))
                    }
                </div>
            </div>

            {/* utility */}
            <div className="flex gap-3 md:justify-normal justify-between items-center md:w-auto w-full md:space-y-0 space-y-2">
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className="flex items-center gap-1 text-accent-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className='min-w-[14px]' width="14px" height="14px" fill="currentColor" viewBox="0 0 16 16"><g clipPath="url(#clip0_10037_38)"><path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z"></path><path d="M2.997 8c0 .425.345.76.76.76h8.486a.75.75 0 00.75-.76.752.752 0 00-.76-.76H3.757a.758.758 0 00-.76.76z"></path></g><defs><clipPath id="clip0_10037_38"><rect width="16" height="16"></rect></clipPath></defs></svg>
                                <p className='text-[12px] leading-[1] text-left'>Filter Token</p>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='w-[200px] space-y-1 p-2 dark:bg-[#26282c]'>
                            <DropdownMenuLabel className='font-[400] text-[12px] text-[rgb(110,114,125)]'>Filter Token</DropdownMenuLabel>
                            <div className='flex flex-col space-y-2'>
                                <div className="">
                                    <input type="text" name='filter-1' className='outline-none border capitalize font-normal dark:bg-transparent text-[14px] px-1 py-1 rounded-md w-full focus:border-[#111111] hover:border-[#111111]' placeholder='filter 1' />
                                </div>
                                <div className="">
                                    <input type="text" name='filter-2' className='outline-none border capitalize font-normal dark:bg-transparent text-[14px] px-1 py-1 rounded-md w-full focus:border-[#111111] hover:border-[#111111]' placeholder='filter 1' />
                                </div>
                                <div className="">
                                    <input type="text" name='filter-3' className='outline-none border capitalize font-normal dark:bg-transparent text-[14px] px-1 py-1 rounded-md w-full focus:border-[#111111] hover:border-[#111111]' placeholder='filter 1' />
                                </div>
                                <div className="">
                                    <input type="text" name='filter-4' className='outline-none border capitalize font-normal dark:bg-transparent text-[14px] px-1 py-1 rounded-md w-full focus:border-[#111111] hover:border-[#111111]' placeholder='filter 1' />
                                </div>
                                <div className="">
                                    <input type="text" name='filter-5' className='outline-none border capitalize font-normal dark:bg-transparent text-[14px] px-1 py-1 rounded-md w-full focus:border-[#111111] hover:border-[#111111]' placeholder='filter 1' />
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <div className="flex gap-2 justify-between">
                                <button className='bg-[#E2E8F0] dark:bg-[#393c43] font-[600] rounded-md text-[12px] py-1 w-full'>Reset</button>
                                <button className='bg-[#111111] dark:bg-white font-[600] rounded-md text-white dark:text-black text-[12px] py-1 w-full'>Apply</button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex items-center gap-2">
                        <Checkbox id='honeypot' />
                        <label htmlFor='honeypot' className='text-[12px] cursor-pointer leading-[1] text-left'>Filter Honeypot</label>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#595000"></circle><path d="M8.327 12.602l3.39-5.086a.435.435 0 00-.36-.676H8.69V3.638a.435.435 0 00-.797-.241l-3.39 5.086a.435.435 0 00.362.676H7.53v3.202a.435.435 0 00.796.241z" fill="#FFEC42"></path></svg>
                        <div className="text-[12px] md:block hidden">Linked Buy</div>
                    </div>
                    <div className="border md:w-[80px] w-[60px] flex items-center rounded-sm">
                        <div className="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" fill="currentColor" viewBox="0 0 14 15"><path d="M7.297 0l-.094.32v9.256l.094.094 4.297-2.54L7.297 0z" fill="#fff"></path><path d="M7.297 0L3 7.13l4.297 2.54V0z" fill="#E1E1E1"></path><path d="M7.297 10.483l-.053.065v3.297l.053.155 4.3-6.055-4.3 2.538z" fill="#fff"></path><path d="M7.297 14v-3.517L3 7.945 7.297 14z" fill="#8C8C8C"></path><path d="M7.297 9.67l4.297-2.54-4.297-1.953V9.67z" fill="#D3D3D3"></path><path d="M3 7.13l4.297 2.54V5.177L3 7.13z" fill="#969696"></path></svg>
                        </div>
                        <div className="">
                            <input type="text" className='w-[60px] bg-transparent outline-none text-[12px]' />
                        </div>
                    </div>

                    <Dialog>
                        <DialogTrigger>
                            <div className='outline-none h-[35px] w-[35px] flex justify-center items-center rounded-md text-accent-4'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8.652 2.05a2.75 2.75 0 012.696 0l4.977 2.8a2.75 2.75 0 011.402 2.397v5.51a2.75 2.75 0 01-1.402 2.397l-4.977 2.8a2.75 2.75 0 01-2.696 0l-4.978-2.8a2.75 2.75 0 01-1.402-2.397v-5.51c0-.994.536-1.91 1.402-2.397l4.978-2.8zm1.96 1.308a1.25 1.25 0 00-1.225 0l-4.977 2.8a1.25 1.25 0 00-.638 1.089v5.51c0 .451.244.868.638 1.09l4.977 2.799c.38.214.845.214 1.226 0l4.977-2.8a1.25 1.25 0 00.637-1.09v-5.51a1.25 1.25 0 00-.637-1.089l-4.977-2.8z"></path>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10 8.133a1.866 1.866 0 100 3.733 1.866 1.866 0 000-3.733zM6.634 9.999a3.366 3.366 0 116.733 0 3.366 3.366 0 01-6.733 0z"></path>
                                </svg>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>

                </div>

            </div>

        </div >
    )
}
