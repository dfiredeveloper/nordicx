"use client";
import {
  localStore,
  themeMode,
  updateUrlParams,
} from "@/lib/utils";
import Image from "next/image";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dynamic from 'next/dynamic';
import { FC } from 'react';
import type { CmcTrendingToken } from '@/lib/services/coinmarketcap';
interface BlockiesProps {
  seed: string;
  size?: number;
  scale?: number;
  className?: string;
}
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const Blockies = dynamic(() => import('react-blockies'), { ssr: false }) as unknown as FC<BlockiesProps>;


export default function Header() {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const [switchMode, setSwitchMode] = useState(false);
  const [triggerInputDrop, setTriggerForInputDrpDown] = useState(false);
  
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const navLinks = [
    {
      link: "/new-pair",
      linkText: "New pair",
    },
    {
      link: "/",
      linkText: "Trending",
    },
    {
      link: "/holding",
      linkText: "Holding",
    },
  ];

  const selectNetwork = [
    {
      img: "/static/solana.webp",
      ntwk: "sol",
    },
    {
      img: "/static/ether.webp",
      ntwk: "eth",
    },
    {
      img: "/static/base.webp",
      ntwk: "base",
    },
    {
      img: "/static/bsc.png",
      ntwk: "bsc",
    },
    {
      img: "/static/sonic.webp",
      ntwk: "sonic",
    },
    {
      img: "/static/tron.webp",
      ntwk: "tron",
    },
    {
      img: "/static/blast.webp",
      ntwk: "blast",
    },
  ];

  const language = [
    {
      lang: "English",
    },
    {
      lang: "简体中文",
    },
    {
      lang: "繁體中文",
    },
    {
      lang: "한국어",
    },
  ];

  useEffect(() => {
    themeMode().default();
    setSwitchMode(themeMode().getFromStore() == "dark");
    updateUrlParams({ chain: localStore("network") || "sol" });

    if (pathname == "/meme" && (params?.get("chain") ?? "sol") != "sol") {
      router.push("/");
    }
  }, [pathname, params, router]);

  // EVM wallet info
  const { address: evmAddress, isConnected, isConnecting } = useAccount();
  const { data: evmBalance } = useBalance({ address: evmAddress });
  const { disconnect: evmDisconnect } = useDisconnect();
  const { openConnectModal, connectModalOpen } = useConnectModal();

  const [forceCloseAttempts, setForceCloseAttempts] = useState(0);
  const [lastConnectionAttempt, setLastConnectionAttempt] = useState<number>(0);
  const [modalCloseTimeout, setModalCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  const useForceCloseModal = () => {
    const closeModal = useCallback(() => {
      if (modalCloseTimeout) {
        clearTimeout(modalCloseTimeout);
      }
      
      const timeout = setTimeout(() => {
        console.log('Force closing modal after timeout');
        forceCloseRainbowKitModal();
        
        setTimeout(() => {
          if (connectModalOpen) {
            console.log('Modal still open after 3 seconds, forcing refresh');
            window.location.reload();
          }
        }, 3000);
      }, 1000);
      
      setModalCloseTimeout(timeout);
    }, [modalCloseTimeout, connectModalOpen]);
    
    return closeModal;
  };

  const forceCloseModal = useForceCloseModal();

  useEffect(() => {
    console.log('Wallet state changed:', {
      address: evmAddress,
      isConnected,
      isConnecting,
      connectModalOpen,
      forceCloseAttempts,
      lastConnectionAttempt: lastConnectionAttempt ? new Date(lastConnectionAttempt).toISOString() : null,
    });
  }, [evmAddress, isConnected, isConnecting, connectModalOpen, forceCloseAttempts, lastConnectionAttempt]);

  useEffect(() => {
    if (isConnected && connectModalOpen) {
      console.log('Wallet connected, forcing modal to close');
      setForceCloseAttempts(prev => prev + 1);
      forceCloseModal();
      forceCloseRainbowKitModal();
      setTimeout(() => forceCloseRainbowKitModal(), 100);
      setTimeout(() => forceCloseRainbowKitModal(), 500);
      setTimeout(() => forceCloseRainbowKitModal(), 1000);
      setTimeout(() => forceCloseRainbowKitModal(), 2000);
    }
  }, [isConnected, connectModalOpen, forceCloseModal]);

  const forceCloseRainbowKitModal = () => {
    try {
      console.log('Attempting to force close RainbowKit modal');
      
      const rainbowKitModals = document.querySelectorAll('[data-rk]');
      rainbowKitModals.forEach(modal => {
        if (modal instanceof HTMLElement) {
          const closeButtons = modal.querySelectorAll('button[aria-label="Close"], [data-testid="close"], .close-button');
          closeButtons.forEach(btn => {
            if (btn instanceof HTMLElement) {
              btn.click();
            }
          });
          modal.click();
        }
      });
      
      const allPortals = document.querySelectorAll('[data-radix-portal], [role="dialog"], [aria-modal="true"]');
      allPortals.forEach(portal => {
        if (portal instanceof HTMLElement) {
          const closeButtons = portal.querySelectorAll('button[aria-label="Close"], [data-testid="close"], .close-button, [aria-label="Close dialog"]');
          closeButtons.forEach(btn => {
            if (btn instanceof HTMLElement) {
              btn.click();
            }
          });
          portal.click();
        }
      });
      
      const modalBackdrops = document.querySelectorAll('[data-radix-portal] > div');
      modalBackdrops.forEach(backdrop => {
        if (backdrop instanceof HTMLElement && backdrop.style.position === 'fixed') {
          backdrop.remove();
        }
      });
      
      window.dispatchEvent(new CustomEvent('forceCloseWalletModal'));
      
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const escEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true,
            cancelable: true
          });
          document.dispatchEvent(escEvent);
        }, i * 100);
      }
      
      try {
        // @ts-expect-error - Accessing RainbowKit's internal modal API for programmatic close
        if (window.__RAINBOW_KIT__ && window.__RAINBOW_KIT__.modal) {
          // @ts-expect-error - Calling internal modal close method
          window.__RAINBOW_KIT__.modal.close();
        }
      } catch {
        console.log('Could not access RainbowKit internal state');
      }
      
      const allModalElements = document.querySelectorAll('[data-rk], [data-radix-portal], [role="dialog"], [aria-modal="true"]');
      allModalElements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.display = 'none';
          element.remove();
        }
      });
      
    } catch (error) {
      console.error('Error in forceCloseRainbowKitModal:', error);
    }
  };

  useEffect(() => {
    if (!connectModalOpen) {
      setForceCloseAttempts(0);
    }
  }, [connectModalOpen]);

  useEffect(() => {
    return () => {
      if (modalCloseTimeout) {
        clearTimeout(modalCloseTimeout);
      }
    };
  }, [modalCloseTimeout]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && connectModalOpen) {
        console.log('ESC pressed, attempting to close modal');
        event.preventDefault();
        event.stopPropagation();
        forceCloseRainbowKitModal();
      }
    };

    const handleGlobalClick = (event: MouseEvent) => {
      if (connectModalOpen) {
        const target = event.target as HTMLElement;
        const isOutsideModal = !target.closest('[data-rk]') && 
                              !target.closest('[data-radix-portal]') && 
                              !target.closest('[role="dialog"]');
        if (isOutsideModal) {
          console.log('Click outside modal detected, closing modal');
          forceCloseRainbowKitModal();
        }
      }
    };

    const handleForceCloseModal = () => {
      console.log('Force close modal event received');
      forceCloseRainbowKitModal();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleGlobalClick);
    window.addEventListener('forceCloseWalletModal', handleForceCloseModal);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('forceCloseWalletModal', handleForceCloseModal);
    };
  }, [connectModalOpen]);

  const accountBtnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isEvmConnected = !!evmAddress;
  const evmAvatarSeed = evmAddress ? evmAddress.toLowerCase() : 'default';
  const evmChainIcon = '/static/ether.webp'; 

  // Account button (shows when connected)
  const renderAccountButton = () => {
    if (isEvmConnected) {
      return (
       
        <button 
          ref={accountBtnRef} 
          onClick={() => setAccountDropdownOpen(prev => !prev)} 
          className="flex items-center gap-2 px-3 py-1 rounded-md bg-accent-4 text-xs font-[600] text-white dark:text-black relative min-h-[32px] min-w-[90px]"
        >
          <Blockies seed={evmAvatarSeed} size={8} scale={2} className="w-5 h-5 rounded-full border" />
          <Image src={evmChainIcon} alt="chain" width={12} height={12} className="w-3 h-3" />
          <span>{evmBalance ? `${parseFloat(evmBalance.formatted).toFixed(4)} ${evmBalance.symbol}` : '0'}</span>
        </button>
      );
    }
    return null;
  };

  const renderAccountDropdown = () => {
    const address = isEvmConnected ? evmAddress : null; 
    return (
     
      <div 
        ref={dropdownRef} 
        className="absolute right-0 mt-2 z-50 w-[340px] bg-[#18181b] rounded-xl shadow-lg p-6 text-white" 
        style={{top: '100%'}}
      >
        <div className="flex flex-col items-center gap-2 mb-4">
          <Blockies seed={evmAvatarSeed} size={12} scale={6} className="w-16 h-16 rounded-full border-2 border-accent-4" />
          <div className="flex items-center gap-2 mt-2">
            <Image src={evmChainIcon} alt="chain" width={24} height={24} className="w-6 h-6" />
            <span className="font-bold text-lg">{evmBalance ? `${parseFloat(evmBalance.formatted).toFixed(4)} ${evmBalance.symbol}` : '0'}</span>
          </div>
          <span className="text-xs text-accent-1 bg-[#23242a] px-2 py-1 rounded mt-1">{address && address.slice(0, 6) + '...' + address.slice(-4)}</span>
        </div>
        <div className="flex flex-col gap-2 mt-2">
         
          <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-[#23242a]">
            <svg width="20" height="20" fill="currentColor" className="text-accent-1"><rect width="20" height="20" rx="4" fill="#23242a"/><path d="M6 8h8v2H6V8zm0 4h5v2H6v-2z" fill="#fff"/></svg>
            My Wallet
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-[#23242a]">
            <svg width="20" height="20" fill="currentColor" className="text-accent-1"><rect width="20" height="20" rx="4" fill="#23242a"/><path d="M10 4v8m0 0l3-3m-3 3l-3-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Referral
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gradient-to-r from-green-400 to-blue-400">
            <svg width="20" height="20" fill="currentColor" className="text-accent-1"><rect width="20" height="20" rx="4" fill="#23242a"/><path d="M8 12l2-2 2 2m-2-2v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Contest(S6)
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-[#23242a]">
            <svg width="20" height="20" fill="currentColor" className="text-accent-1"><rect width="20" height="20" rx="4" fill="#23242a"/><path d="M10 8v4m0 0l3-3m-3 3l-3-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            TG Alert Tutorial
          </button>
          <button onClick={async () => {
            if (isEvmConnected) {
              await Promise.resolve(evmDisconnect());
            }
            setTimeout(() => {
              console.log('EVM address after disconnect:', evmAddress);
            }, 500);
            window.location.reload();
          }} className="flex items-center gap-2 px-4 py-2 rounded hover:bg-[#23242a] text-red-400">
            <svg width="20" height="20" fill="currentColor" className="text-accent-1"><rect width="20" height="20" rx="4" fill="#23242a"/><path d="M6 6l8 8M6 14L14 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Disconnect
          </button>
        </div>
      </div>
    );
  };
  
  useEffect(() => {
   
    if (!accountDropdownOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        accountBtnRef.current && 
        !accountBtnRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setAccountDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [accountDropdownOpen]); 

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<CmcTrendingToken[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTouched, setSearchTouched] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetch(`/api/search-tokens?query=${encodeURIComponent(search)}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data.tokens || []);
          setSearchLoading(false);
        })
        .catch(() => {
          setSearchResults([]);
          setSearchLoading(false);
        });
    }, 350);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search]);

  return (
    <div className="">
      <div className="md:px-[1.3rem] px-[.5rem] h-[56px] flex items-center gap-5 justify-between w-full">
       
        <div className="flex items-center gap-5">
          <div className="">
            <Image
              src="/logo_light.svg"
              width={120}
              height={120}
              alt="logo light"
              className=" dark:hidden md:block hidden md:min-w-[170px] min-w-[100px]"
            />
            <Image
              src="/logo_black.svg"
              width={120}
              height={120}
              alt="logo dark"
              className=" md:dark:block md:block hidden md:min-w-[170px] min-w-[100px]"
            />
            <Image
              src="/logo_black.svg"
              width={120}
              height={120}
              alt="logo dark"
              className="md:hidden  min-w-[100px] translate-x-[-10px]"
            />
          </div>
          <ul className="md:flex gap-3 hidden overflow-hidden">
            {navLinks.map((item, index) => {
              const isActive = pathname === item.link;
              const linkClassName = `h-full w-full ${
                isActive ? "dark:text-white text-black" : "text-accent-1"
              }`;

              return (
                <li
                  key={index}
                  className="font-medium text-sm whitespace-nowrap"
                >
                  <Link
                    href={
                      item.link === "/meme"
                        ? `${item.link}?chain=sol&tab=home`
                        : item.link
                    }
                    className={linkClassName}
                  >
                    {item.linkText}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

       
        <div className="relative max-w-[440px] w-full md:flex mx-[24px] hidden">
          <div className="w-full relative h-[40px] rounded-lg overflow-hidden hover:border-inherit border border-transparent">
            <div className="absolute z-[2]  top-0 h-[40px] left-[4px] flex items-center justify-center text-accent-4  text-aux-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.25rem"
                height="1.25rem"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.213 1.988a7.14 7.14 0 017.135 7.234c-.035 3.922-3.28 7.111-7.203 7.082-3.985-.03-7.181-3.276-7.14-7.25.042-3.933 3.253-7.081 7.208-7.066zm-.058 12.61a5.473 5.473 0 005.508-5.412c.04-3.025-2.465-5.536-5.51-5.524-3.007.012-5.45 2.467-5.45 5.476a5.455 5.455 0 005.452 5.46z"></path>
                <path d="M16.666 17.795l-1.24-1.24a.75.75 0 010-1.056l.055-.055a.749.749 0 011.056 0l1.24 1.24a.75.75 0 010 1.057l-.054.054a.75.75 0 01-1.057 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setSearchTouched(true); setTriggerForInputDrpDown(true); }}
              onFocus={() => setTriggerForInputDrpDown(true)}
              onBlur={() => setTimeout(() => setTriggerForInputDrpDown(false), 150)}
              className="w-full h-full pl-8 placeholder:opacity-50 outline-none text-xs bg-accent-2"
              placeholder="Search token/contract/wallet"
            />
            <div className="h-[40px] flex justify-center items-center  absolute right-0 top-0 z-[2]">
              <div className="flex h-[1.25rem] bg-accent-3 rounded-[4px] justify-center items-center px-1 text-aux-1 text-[12px] whitespace-nowrap">
                Ctrl alt K
              </div>
            </div>
          </div>

          {/* drop down */}
          {!!triggerInputDrop && (
            <div className="absolute w-full bg-accent-2 rounded-md left-0 top-[50px] p-3 h-[400px] overflow-y-auto scroll-smooth z-50">
              {searchLoading ? (
                <div className="text-center py-4 text-xs text-gray-400">Searching...</div>
              ) : search && searchResults.length === 0 && searchTouched ? (
                <div className="text-center py-4 text-xs text-gray-400">No tokens found.</div>
              ) : (
                <div className="mt-1 space-y-2 ">
                  {searchResults.slice(0, 20).map((token, i) => (
                    <Link
                      key={token.id || i}
                      href={`/${token.platform?.toLowerCase() || 'eth'}/token/${token.contract_address || token.id}`}
                      role="button"
                      className="flex items-center justify-between p-2 hover:bg-accent-3 rounded-lg"
                      onClick={() => setTriggerForInputDrpDown(false)}
                    >
                      <div className="flex gap-2 items-center">
                        <div className="rounded-full border w-fit relative">
                          <Image
                            src={token.logo || "/static/3717.png"}
                            className="w-[35px] h-[35px]"
                            width={35}
                            height={35}
                            alt={token.name}
                            unoptimized
                          />
                        </div>
                        <div>
                          <div className="max-w-[13rem] text-ellipsis overflow-hidden whitespace-nowrap text-[15px] font-[600] uppercase leading-[20px]">
                            {token.name} <span className="text-xs text-accent-1">{token.symbol}</span>
                          </div>
                          <div className="text-[12px] text-accent-1">
                            {token.contract_address ? `${token.contract_address.slice(0, 6)}...${token.contract_address.slice(-4)}` : '--'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="max-w-[13rem] text-ellipsis overflow-hidden whitespace-nowrap text-[15px] font-[600] uppercase leading-[20px]">
                          {typeof token.price === 'number' ? `$${token.price.toLocaleString(undefined, { maximumFractionDigits: 6 })}` : '--'}
                        </div>
                        <div className="text-[13px] text-[rgb(223,72,76)]/80">
                          {token.percent_change_24h ? `${token.percent_change_24h > 0 ? '+' : ''}${token.percent_change_24h.toFixed(2)}%` : ''}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2 md:pr-[100px] items-center">
            <Select
              defaultValue={localStore("network") || "sol"}
              onValueChange={(v) => {
                updateUrlParams({ chain: v.toLowerCase() });
                window.localStorage.setItem("network", v);
              }}
            >
              <SelectTrigger className="md:w-[130px] w-[80px] p-0 md:bg-accent-2 rounded-xl border-none outline-none focus:ring-0">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {selectNetwork.map(({ img, ntwk }, i) => (
                  <SelectItem value={ntwk} key={i}>
                    <div className="flex items-center gap-1 uppercase">
                      <Image
                        src={img}
                        alt={ntwk}
                        className="w-[18px] h-[18px]"
                        width={10}
                        height={10}
                      />
                      {ntwk}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* display on mobile -search */}
            <Dialog>
              <DialogTrigger>
                <div className="md:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15px"
                    height="15px"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.5 2.8a4.7 4.7 0 100 9.4 4.7 4.7 0 000-9.4zM1.2 7.5a6.3 6.3 0 1112.6 0 6.3 6.3 0 01-12.6 0z"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.934 10.934a.8.8 0 011.132 0l3 3a.8.8 0 11-1.132 1.132l-3-3a.8.8 0 010-1.132z"
                    ></path>
                  </svg>
                </div>
              </DialogTrigger>
              <DialogContent className="h-full bg-[#f4f4f5] w-full p-2 overflow-y-scroll">
                <DialogHeader>
                  <DialogTitle className="text-left absolute top-4">
                    Search
                  </DialogTitle>
                </DialogHeader>
                <div className="pt-8">
                  <div className="w-full relative h-[40px] rounded-lg overflow-hidden ">
                    <div className="absolute z-[2]  top-0 h-[40px] left-[4px] flex items-center justify-center text-accent-search">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.25rem"
                        height="1.25rem"
                        fill="#AEB2BD"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.213 1.988a7.14 7.14 0 017.135 7.234c-.035 3.922-3.28 7.111-7.203 7.082-3.985-.03-7.181-3.276-7.14-7.25.042-3.933 3.253-7.081 7.208-7.066zm-.058 12.61a5.473 5.473 0 005.508-5.412c.04-3.025-2.465-5.536-5.51-5.524-3.007.012-5.45 2.467-5.45 5.476a5.455 5.455 0 005.452 5.46z"></path>
                        <path d="M16.666 17.795l-1.24-1.24a.75.75 0 010-1.056l.055-.055a.749.749 0 011.056 0l1.24 1.24a.75.75 0 010 1.057l-.054.054a.75.75 0 01-1.057 0z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={search}
                      onChange={e => { setSearch(e.target.value); setSearchTouched(true); }}
                      className="w-full h-full pl-8 placeholder:opacity-50 outline-none text-xs"
                      placeholder="Search token/contract/wallet"
                    />
                    <div className="h-[40px] flex justify-center items-center text-accent-4 absolute right-0 top-0 z-[2]">
                      <div className="flex h-[1.25rem] bg-accent-3 rounded-[4px] justify-center items-center px-1 text-[#AEB2BD] text-[12px] whitespace-nowrap">
                        Ctrl alt K
                      </div>
                    </div>
                  </div>

                  <div className=" w-full mt-5 rounded-md h-full overflow-y-auto scroll-smooth">
                    {searchLoading ? (
                      <div className="text-center py-4 text-xs text-gray-400">Searching...</div>
                    ) : search && searchResults.length === 0 && searchTouched ? (
                      <div className="text-center py-4 text-xs text-gray-400">No tokens found.</div>
                    ) : (
                      <div className="mt-1 space-y-2 ">
                        {searchResults.slice(0, 20).map((token, i) => (
                          <Link
                            key={token.id || i}
                            href={`/${token.platform?.toLowerCase() || 'eth'}/token/${token.contract_address || token.id}`}
                            role="button"
                            className="flex items-center justify-between p-2 hover:bg-accent-3 rounded-lg"
                          >
                            <div className="flex gap-2 items-center">
                              <div className="rounded-full border w-fit relative">
                                <Image
                                  src={token.logo || "/static/3717.png"}
                                  className="w-[35px] h-[35px]"
                                  width={35}
                                  height={35}
                                  alt={token.name}
                                  unoptimized
                                />
                              </div>
                              <div>
                                <div className="max-w-[13rem] text-ellipsis overflow-hidden whitespace-nowrap text-[15px] font-[600] uppercase leading-[20px]">
                                  {token.name} <span className="text-xs text-accent-1">{token.symbol}</span>
                                </div>
                                <div className="text-[12px] text-accent-1">
                                  {token.contract_address ? `${token.contract_address.slice(0, 6)}...${token.contract_address.slice(-4)}` : '--'}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="max-w-[13rem] text-ellipsis overflow-hidden whitespace-nowrap text-[15px] font-[600] uppercase leading-[20px]">
                                {typeof token.price === 'number' ? `$${token.price.toLocaleString(undefined, { maximumFractionDigits: 6 })}` : '--'}
                              </div>
                              <div className="text-[13px] text-[rgb(223,72,76)]/80">
                                {token.percent_change_24h ? `${token.percent_change_24h > 0 ? '+' : ''}${token.percent_change_24h.toFixed(2)}%` : ''}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="hover:bg-accent-2 duration-150 h-[35px] w-[35px] flex justify-center items-center rounded-md text-accent-search">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    className="text-accent-4"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.652 2.05a2.75 2.75 0 012.696 0l4.977 2.8a2.75 2.75 0 011.402 2.397v5.51a2.75 2.75 0 01-1.402 2.397l-4.977 2.8a2.75 2.75 0 01-2.696 0l-4.978-2.8a2.75 2.75 0 01-1.402-2.397v-5.51c0-.994.536-1.91 1.402-2.397l4.978-2.8zm1.96 1.308a1.25 1.25 0 00-1.225 0l-4.977 2.8a1.25 1.25 0 00-.638 1.089v5.51c0 .451.244.868.638 1.09l4.977 2.799c.38.214.845.214 1.226 0l4.977-2.8a1.25 1.25 0 00.637-1.09v-5.51a1.25 1.25 0 00-.637-1.089l-4.977-2.8z"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10 8.133a1.866 1.866 0 100 3.733 1.866 1.866 0 000-3.733zM6.634 9.999a3.366 3.366 0 116.733 0 3.366 3.366 0 01-6.733 0z"
                    ></path>
                  </svg>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[250px] space-y-1">
                <DropdownMenuItem>
                  <div className="flex justify-between w-full items-center">
                    <div className="text-xs">Alert Settings</div>
                    <div className="rotate-[-90deg] text-accent-search">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12px"
                        height="12px"
                        fill="currentColor"
                        className=""
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M2.273 5.675a.933.933 0 011.32 0l4.674 4.674 4.673-4.674a.933.933 0 011.32 1.32L8.267 12.99 2.273 6.995a.933.933 0 010-1.32z"
                        ></path>
                      </svg>
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
                        <SelectContent className="bg-accent-3">
                          {language.map(({ lang }, i) => (
                            <SelectItem value={lang} key={i}>
                              <div className="flex items-center gap-1">
                                {lang}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DropdownMenuItem>

                <div className="px-2 mt-2">
                  <div className="flex w-full justify-between">
                    <div className="text-xs">Dark Mode</div>
                    <div className="">
                      <Switch
                        defaultChecked={switchMode}
                        onCheckedChange={() => {
                          const s = themeMode().switch();
                          setSwitchMode(s);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {isEvmConnected ? (
            <div className="relative">
              {renderAccountButton()}
            
              {accountDropdownOpen && renderAccountDropdown()}
            </div>
          ) : (
            <>
              <button
                className="md:px-4 px-2 py-[0.4rem] rounded-md bg-accent-4 text-xs font-[600] text-white dark:text-black"
                onClick={() => {
                  const now = Date.now();
                  setLastConnectionAttempt(now);
                  
                  if (connectModalOpen) {
                    console.log('Modal is already open, attempting to close first');
                    try {
                      const modalOverlays = document.querySelectorAll('[data-radix-portal]');
                      modalOverlays.forEach(overlay => {
                        if (overlay instanceof HTMLElement) {
                          overlay.click();
                        }
                      });
                      
                      window.dispatchEvent(new CustomEvent('forceCloseWalletModal'));
                      
                      setTimeout(() => {
                        if (openConnectModal) {
                          openConnectModal();
                        }
                      }, 100);
                    } catch (error) {
                      console.error('Error closing stuck modal:', error);
                      window.location.reload();
                    }
                    return;
                  }
                  if (openConnectModal) {
                    openConnectModal();
                  } else {
                    console.error('Connect modal not available');
                  }
                }}
              >
                Connect
              </button>
              {connectModalOpen && (
                <button
                  className="md:px-2 px-1 py-[0.4rem] rounded-md bg-red-500 text-xs font-[600] text-white"
                  onClick={() => {
                    console.log('Emergency modal close');
                    try {
                      const modalOverlays = document.querySelectorAll('[data-radix-portal]');
                      modalOverlays.forEach(overlay => {
                        if (overlay instanceof HTMLElement) {
                          overlay.click();
                        }
                      });
                      
                      window.dispatchEvent(new CustomEvent('forceCloseWalletModal'));
                      
                    } catch (error) {
                      console.error('Error in emergency modal close:', error);
                      window.location.reload();
                    }
                  }}
                >
                  Close Modal
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="bg-accent-3 border-t w-full overflow-x-auto">
        <ul className="md:hidden gap-3 flex py-2 px-5">
          {navLinks.map((item, index) => {
            const isActive = pathname === item.link;
            const linkClassName = `h-full w-full ${
              isActive ? "dark:text-white text-black" : "text-accent-1"
            }`;

            return (
              <li key={index} className="font-medium text-sm whitespace-nowrap">
                <Link
                  href={
                    item.link === "/meme"
                      ? `${item.link}?chain=sol&tab=new-creation`
                      : item.link
                  }
                  className={linkClassName}
                >
                  {item.linkText}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}