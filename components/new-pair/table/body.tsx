// Full body.tsx restored with closing tag fix
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function TableBody() {
    const searchParams = useSearchParams();
    const chain = searchParams?.get("chain") ?? "eth";

    const token = {
        contract_address: "0x0000000000000000000000000000000000000000",
        name: "Stars"
    };

    return (
        <tbody className="md:text-[14px] text-[13px] divide-y">
            {Array(40).fill(0).map((_, index) => (
                    <tr key={index}>
                <td className="py-3 px-2 sticky z-[1] left-0 bg-accent-2 ">
                        <Link
                            role="button"
                            className="flex items-center md:w-[321px] w-[136px] md:flex-[321px] flex-[136px]"
                            href={{
                                pathname: `/${chain}/token/${token.contract_address}`,
                                query: { data: encodeURIComponent(JSON.stringify(token)) },
                            }}
                        >
                        <div className="flex items-center gap-2">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="md:w-[16px] w-[13px]" width="16px" height="16px" fill="#AEB2BD" viewBox="0 0 16 16">
                                        <g clipPath="url(#clip0_6939_489)">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M6.421.99a1.754 1.754 0 013.158 0l1.587 3.127 3.352.603c1.414.254 1.976 2.051.975 3.121l-2.37 2.536.484 3.5c.204 1.477-1.267 2.587-2.554 1.93L8 14.245l-3.053 1.56c-1.287.658-2.758-.452-2.554-1.929l.484-3.5L.507 7.84c-1-1.07-.439-2.867.975-3.121l3.352-.603L6.421.99z"></path>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_6939_489">
                                                <rect width="16" height="16" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="rounded-full border w-fit relative">
                                        <Image src="/static/3717.png" className="md:w-[30px] w-[25px] md:h-[30px] h-[25px]" width={35} height={35} alt="" />
                                        <Image src="/static/ether.webp" className="md:w-[15px] w-[10px] md:h-[15px] h-[10px] absolute bottom-0 right-0" width={15} height={15} alt="" />
                                    </div>
                                    <div>
                                    <div className="flex items-center gap-1">
                                            <h1 className="uppercase md:text-[14px] text-[13px] font-[400]">{token.name}</h1>
                                        <div className="flex gap-1">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                            <span onClick={() => window.open('https://twitter.com', '_blank')} style={{ cursor: 'pointer' }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" fill="#AEB2BD" viewBox="0 0 12 12">
                                                                    <g clipPath="url(#clip0_9095_133)">
                                                                        <path d="M5.406 0a5.355 5.355 0 015.351 5.425c-.026 2.942-2.46 5.334-5.402 5.312A5.385 5.385 0 010 5.299C.031 2.349 2.44-.011 5.406 0zm-.043 9.457a4.105 4.105 0 004.13-4.059c.03-2.269-1.848-4.151-4.133-4.143a4.112 4.112 0 00-4.087 4.107 4.091 4.091 0 004.09 4.095z"></path>
                                                                        <path d="M10.843 11.676l-.93-.93a.562.562 0 010-.792l.041-.04a.562.562 0 01.792 0l.93.93a.562.562 0 010 .792l-.04.04a.562.562 0 01-.793 0z"></path>
                                                                    </g>
                                                                    <defs>
                                                                        <clipPath id="clip0_9095_133">
                                                                            <rect width="12" height="12" />
                                                                        </clipPath>
                                                                    </defs>
                                                                </svg>
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent className='bg-accent-3 text-[#111111] text-[12px] font-[400]'>
                                                        <p>Search on twitter</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                                <svg
                                                    className="md:hidden block cursor-pointer"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12px"
                                                    height="12px"
                                                    fill="#AEB2BD"
                                                    viewBox="0 0 12 12"
                                                >
                                                    <g clipPath="url(#clip0_6972_490)">
                                                        <path d="M.5 5.214a2.357 2.357 0 012.357-2.357h3.929a2.357 2.357 0 012.357 2.357v3.929A2.357 2.357 0 016.786 11.5H2.857A2.357 2.357 0 01.5 9.143V5.214z" />
                                                        <path d="M2.987 2.084c.087-.008.174-.013.263-.013h3.929a2.75 2.75 0 012.75 2.75V8.75c0 .089-.005.177-.013.263A2.358 2.358 0 0011.5 6.786V2.857A2.357 2.357 0 009.143.5H5.214c-1.03 0-1.907.662-2.227 1.584z" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_6972_490">
                                                            <rect width="12" height="12" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}
