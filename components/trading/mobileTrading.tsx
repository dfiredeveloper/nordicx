"use client";
import Image from 'next/image'
import React, { useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import AuthLayout from '../common/authLayout';

interface TokenData {
  name?: string;
  symbol?: string;
  price?: number;
  logo?: string;
  price_24h_change?: number;
  [key: string]: unknown;
}

export default function MobileTradingHeader({ tokenData }: { tokenData: TokenData | null }) {
    const [showAuth, setShowAuth] = useState<boolean>(false)

    if (!tokenData) {
      return <div className="flex items-center h-[57px] px-[12px] bg-[#111111]">Loading...</div>;
    }

    return (
        <>
            <div className="flex w-full justify-between items-start px-[10px] py-1 bg-[#111111]">
                <div className="flex flex-col">
                    <div className="flex items-center flex-grow flex-shrink">
                        <div className="flex" onClick={() => setShowAuth(true)}>
                            <div className="cursor-pointer flex mr-[6px]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" fill="#5C6068" viewBox="0 0 16 16"><g clipPath="url(#clip0_6939_489)"><path fillRule="evenodd" clipRule="evenodd" d="M6.421.99a1.754 1.754 0 013.158 0l1.587 3.127 3.352.603c1.414.254 1.976 2.051.975 3.121l-2.37 2.536.484 3.5c.204 1.477-1.267 2.587-2.554 1.93L8 14.245l-3.053 1.56c-1.287.658-2.758-.452-2.554-1.929l.484-3.5L.507 7.84c-1-1.07-.439-2.867.975-3.121l3.352-.603L6.421.99z"></path></g><defs><clipPath id="clip0_6939_489"><rect width="16" height="16"></rect></clipPath></defs></svg>
                            </div>
                        </div>

                        <div role="button" className="flex items-center md:w-[290px] w-[136px] md:flex-[290px] flex-[136px]">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <div className="rounded-full border w-fit relative">
                                        <Image src={tokenData.logo || "/static/3717.png"} className='md:min-w-[40px] min-w-[30px] md:h-[40px] h-[30px]' width={40} height={40} alt={tokenData.symbol || ''} />
                                    </div>
                                    <div className="">
                                        <div className="text-[15px] font-[500] dark:text-[#f5f5f5]">{tokenData.name || '--'}</div>
                                        <div className="flex items-center gap-1">
                                            <p className="text-accent-aux-1 text-[13px]">{tokenData.symbol || '--'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* MOBILE UTILITY */}
                    <div className="flex gap-3 items-center mt-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" fill="#5C6068" viewBox="0 0 12 12"><g clip-path="url(#clip0_9095_133)"><path d="M5.406 0a5.355 5.355 0 015.351 5.425c-.026 2.942-2.46 5.334-5.402 5.312A5.385 5.385 0 010 5.299C.031 2.349 2.44-.011 5.406 0zm-.043 9.457a4.105 4.105 0 004.13-4.059c.03-2.269-1.848-4.151-4.133-4.143a4.112 4.112 0 00-4.087 4.107 4.091 4.091 0 004.09 4.095z"></path><path d="M10.843 11.676l-.93-.93a.562.562 0 010-.792l.041-.04a.562.562 0 01.792 0l.93.93a.562.562 0 010 .792l-.04.04a.562.562 0 01-.793 0z"></path></g><defs><clipPath id="clip0_9095_133"><rect width="12" height="12"></rect></clipPath></defs></svg>
                                </TooltipTrigger>
                                <TooltipContent className='bg-accent-3 text-[#111111] text-[12px] font-[400]'>
                                    <p>Search on twitter</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <svg xmlns="http://www.w3.org/2000/svg" className='text-accent-aux-1' width="18px" height="18px" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" clipRule="evenodd" d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10zM6.465 5.501a.386.386 0 00-.266.11L4.39 7.42a.188.188 0 00.133.32h9.164c.101 0 .197-.04.266-.109l1.81-1.81a.188.188 0 00-.133-.32H6.465zm0 6.758a.376.376 0 00-.266.11l-1.81 1.81a.188.188 0 00.133.32h9.164c.101 0 .197-.04.266-.11l1.81-1.81a.188.188 0 00-.133-.32H6.465zm7.487-3.289a.376.376 0 00-.266-.11H4.522a.188.188 0 00-.133.321l1.81 1.81c.07.07.165.11.266.11h9.164a.188.188 0 00.133-.32l-1.81-1.81z"></path></svg>

                        <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M16.102 9.215a8.041 8.041 0 00-8.365 0L5.966 5.998a11.44 11.44 0 015.954-1.67c2.168 0 4.201.608 5.953 1.67l-1.771 3.218z" fill="url(#paint0_linear_2044_2363)"></path><path d="M6.776 9.901C4.808 11.51 3.542 14.02 3.542 16.84c0 1.026-.793 1.858-1.771 1.858C.793 18.697 0 17.865 0 16.84c0-4.196 1.97-7.91 4.993-10.178l1.783 3.24z" fill="#F04866"></path><path d="M20.296 16.84c0-2.82-1.265-5.33-3.233-6.939l1.782-3.24c3.023 2.268 4.993 5.982 4.993 10.178 0 1.026-.793 1.858-1.77 1.858-.979 0-1.772-.832-1.772-1.858z" fill="#62BA01"></path><path d="M6.001 15.85l5.818-.085a1.65 1.65 0 11-.822 3.066l-4.996-2.982z" fill="#F04866"></path><defs><linearGradient id="paint0_linear_2044_2363" x1="17.096" y1="7.441" x2="8.112" y2="7.441" gradientUnits="userSpaceOnUse"><stop stopColor="#E6D119"></stop><stop offset="1" stopColor="#E6AC19"></stop></linearGradient></defs></svg>
                            <p className='text-[13px] text-accent-aux-1'>{tokenData.price_24h_change?.toFixed(2) || '--'}%</p>
                        </div>

                        <div className="flex w-[80px] rounded-md justify-between items-center border px-2 py-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" fill="#88D693" viewBox="0 0 16 16"><path d="M14.78 3.47a.75.75 0 010 1.06l-8 8a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 011.06-1.06l3.97 3.97 7.47-7.47a.75.75 0 011.06 0z"></path></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" fill="#F04866" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M12.47 2.47a.75.75 0 111.06 1.06L9.06 8l4.47 4.47a.75.75 0 11-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 01-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 011.06-1.06L8 6.94l4.47-4.47z"></path></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" fill="#88D693" viewBox="0 0 16 16"><path d="M14.78 3.47a.75.75 0 010 1.06l-8 8a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 011.06-1.06l3.97 3.97 7.47-7.47a.75.75 0 011.06 0z"></path></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" fill="#88D693" viewBox="0 0 16 16"><path d="M14.78 3.47a.75.75 0 010 1.06l-8 8a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 011.06-1.06l3.97 3.97 7.47-7.47a.75.75 0 011.06 0z"></path></svg>
                        </div>

                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <div className="flex justify-end space-y-2 w-full flex-col mr-[2px]">
                        <div className="flex h-[24px] w-fit sm:text-[20px] text-[16px] font-[500] text-prettyRed">${tokenData.price?.toFixed(8) || '--'}</div>
                        {/* Share */}
                        <div className="flex w-full justify-end dark:text-[#9AA0AA]  items-center text-[12px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" clipRule="evenodd" d="M4 6a2 2 0 012-2h2a1 1 0 000-2H6a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4v-2a1 1 0 10-2 0v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm7-3a1 1 0 011-1h4a2 2 0 012 2v4a1 1 0 11-2 0V5.414l-5.293 5.293a1 1 0 01-1.414-1.414L14.586 4H12a1 1 0 01-1-1z"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
            {
                showAuth && <AuthLayout showAuth={showAuth} setAuthModal={setShowAuth} />
            }
        </>
    )
}
