import Link from "next/link";
import {  useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { formatNumber } from "@/lib/utils";

export default function TableBody({ tokens }) {
    const searchParams = useSearchParams();
    const chain = searchParams?.get("chain") ?? "eth";
    const getChain = useCallback(() => chain, [chain]);
    return tokens.map((token, index) => (
        <tr key={index}>
            <td className="py-3 px-2 sticky z-[1] left-0 bg-accent-2 ">
                {/* token */}
                <Link
                    role="button"
                    className="flex items-center md:w-[321px] w-[136px] md:flex-[321px] flex-[136px]"
                    href={{
                        pathname: `/${chain}/token/${token.contract_address}`,
                        query: { data: encodeURIComponent(JSON.stringify(token)) }
                    }}
                >
                    <div className="flex items-center gap-2">
                        <div>
                            {/* star icon svg */}
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="rounded-full border w-fit relative">
                                {/* token image */}
                            </div>
                            <div>
                                {/* meme name and socials */}
                                <div className="flex items-center gap-1">
                                    {/* name and socials */}
                                </div>
                                <div className="flex items-center gap-1">
                                    {/* address and copy */}
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </td>
                    {/* STATUS */}
                    <td className="py-3 px-2 hidden md:block">
                    <div className="flex md:w-[119px] w-[92px] md:flex-[119px] flex-[92px]">
                        <p className="text-accent-aux-1">1%</p>
                    </div>
                </td>
                    {/* Age */}
                    <td className="py-3 px-2">
                    <div className="md:w-[119px] w-[92px] md:flex-[119px] flex-[92px]">
                        <p className="text-accent-aux-1">29d</p>
                    </div>
                </td>
                    {/* SOL bal */}
                    <td className="py-3 px-2">
                    <div className="md:w-[119px] w-[92px] md:flex-[119px] flex-[92px]">
                        <div className="dark:text-white">0.4532</div>
                    </div>
                </td>
                    {/* holders */}
                    <td className="py-3 px-2">
                    <div className="md:w-[119px] w-[92px] md:flex-[119px] flex-[92px] text-accent-1">
                       1
                    </div>
                </td>
                    {/* 1h txs */}
                    <td className="py-3 px-2">
                    <div className="md:w-[119px] w-[92px] md:flex-[119px] flex-[92px]">
                        <div className="text-accent-1">4</div>
                    </div>
                </td>
                    {/* 1h vol */}
                    <td className="py-3 px-2">
                    <div className="md:w-[119px] w-[92px] md:flex-[119px] flex-[92px]">
                        <div className="text-[#AEB2DB]">${formatNumber(1000)}</div>
                    </div>
                </td>
                    {/* mrk cap */}
                    <td className="py-3 px-2">
                    <div className="md:w-[119px] w-[92px] md:flex-[119px] flex-[92px]">
                        <div className="text-accent-green">${formatNumber(1000)}</div>
                    </div>
                </td>
                    {/* Last */}
                    <td className="py-3 px-2">
                    <div className="md:w-[119px] w-[92px] md:flex-[119px] flex-[92px]">
                        <div className="text-accent-green">10s</div>
                    </div>
                </td>
                    {/* HODL */}
                <td className="py-3 px-2">
                    <div className="md:w-[119px] w-[92px] md:flex-[119px] flex-[92px]">
                        <div className="text-accent-1">--</div>
                        <div className="text-accent-green text-[13px]">HODL</div>
                    </div>
                </td>
                    {/* Buy button */}
                <td className="py-3 px-2 sticky right-0 z-[1] bg-accent-2">
                    <div className="md:w-[101px] md:flex-[101px] w-[48px] flex-[48px]">
                        <button className="flex items-center justify-center h-[25px] px-[6px] rounded-md gap-1 hover:bg-[rgb(238,239,242)] dark:hover:bg-[rgb(82,86,93)] dark:hover:text-[rgb(245,245,245)] hover:text-[rgb(41,44,51)] w-fit">
                            {
                                getChain() == "sol" ?
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="#88D693" viewBox="0 0 16 16"><g clipPath="url(#clip0_9339_171)"><path d="M3.229 9.046L9.756 0 8.452 6.637h3.757a.2.2 0 01.162.317L5.844 16 7.03 9.363H3.39a.2.2 0 01-.161-.317z"></path><path fillRule="evenodd" clipRule="evenodd" d="M1.5 8a6.5 6.5 0 017.933-6.341L9.63.678A7.5 7.5 0 004.9 14.832l.187-1.02A6.5 6.5 0 011.5 8zm4.663 6.237l-.174.99a7.5 7.5 0 004.781-14.2l-.231.987a6.502 6.502 0 01-4.376 12.223z"></path><path fillRule="evenodd" clipRule="evenodd" d="M6.711 1.63c.508-.133 1.013.827.681 1.602-.335.78.978-.978 1.497-1.866L7.023.813l-.312.818zm1.575 10.985c-.345.54-.673 1.897.343 1.85 1.052-.049-.925.19-2.074.124 0 0 2.075-2.513 1.73-1.974z"></path></g><defs><clipPath id="clip0_9339_171"><rect width="16" height="16"></rect></clipPath></defs></svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" className="md:w-[12px] w-[20px]" fill="currentColor" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#595000"></circle><path d="M8.327 12.602l3.39-5.086a.435.435 0 00-.36-.676H8.69V3.638a.435.435 0 00-.797-.241l-3.39 5.086a.435.435 0 00.362.676H7.53v3.202a.435.435 0 00.796.241z" fill="#FFEC42"></path></svg>
                            }
                            <div className="text-[12px] md:block hidden">Buy</div>
                        </button>
                    </div>
                </td>
                </tr>
            ))
}
