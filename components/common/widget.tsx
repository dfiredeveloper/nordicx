'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface HotPair {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  image: string;
}

function MemeCoinsWidget() {
    const [hotPairs, setHotPairs] = useState<HotPair[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotPairs = async () => {
            try {
                const response = await fetch('/api/hot-pairs');
                const data = await response.json();
                
                if (data.success && data.data) {
                    setHotPairs(data.data);
                } else {
                    console.error('Failed to fetch hot pairs:', data.error);
                }
            } catch (error) {
                console.error('Error fetching hot pairs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotPairs();
        
        // Refresh every 5 minutes
        const interval = setInterval(fetchHotPairs, 5 * 60 * 1000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="overflow-hidden w-full h-[35px] relative">
            <div className="absolute left-0 right-0 z-10 h-full w-fit px-3 flex justify-center dark:bg-[#111111]">
                <div className="flex gap-1 items-center text-[#ffc762] text-[13px]">
                    <svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="fire" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z"></path></svg>
                    <p className='uppercase whitespace-nowrap text-white sm:block hidden'>Hot pairs</p>
                </div>
            </div>
            <div className="flex animate-slide gap-12 px-4">
                {loading ? (
                    // Loading state
                    <div className="ml-[5rem] flex items-center gap-3">
                        {Array(10).fill(0).map((_, index) => (
                            <div key={index} className="flex-shrink-0 w-fit flex items-center gap-2 text-[12px] animate-pulse">
                                <div className="w-6 h-6 bg-gray-600 rounded"></div>
                        <div>
                                    <div className="w-16 h-3 bg-gray-600 rounded mb-1"></div>
                                    <div className="w-12 h-2 bg-gray-600 rounded"></div>
                                </div>
                        </div>
                        ))}
                    </div>
                ) : (
                    // Real data
                    <>
                <div className="ml-[5rem] flex items-center gap-3">
                            {[...hotPairs, ...hotPairs].slice(0, 10).map((pair, index) => (
                        <div
                                    key={`${pair.id}-${index}`}
                                    className="flex-shrink-0 w-fit flex items-center gap-2 text-[12px] hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors"
                        >
                                    <Image
                                      src={pair.image || "/static/3717.png"}
                                      alt={pair.symbol}
                                      width={20}
                                      height={20}
                                      className="rounded-full"
                                      style={{ minWidth: 20, minHeight: 20 }}
                                    />
                            <div>
                                        <div className="font-bold text-white">{pair.name.toUpperCase()}</div>
                                        <div className="text-gray-400">{pair.priceChange24h >= 0 ? '+' : ''}{pair.priceChange24h.toFixed(2)}%</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="ml-[10rem] flex items-center gap-8">
                            {[...hotPairs, ...hotPairs].slice(10, 20).map((pair, index) => (
                        <div
                                    key={`${pair.id}-${index + 10}`}
                                    className="flex-shrink-0 w-fit flex items-center gap-2 text-[12px] hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors"
                        >
                                    <Image
                                      src={pair.image || "/static/3717.png"}
                                      alt={pair.symbol}
                                      width={20}
                                      height={20}
                                      className="rounded-full"
                                      style={{ minWidth: 20, minHeight: 20 }}
                                    />
                            <div>
                                        <div className="font-bold text-white">{pair.name.toUpperCase()}</div>
                                        <div className="text-gray-400">${(pair.volume24h / 1000).toFixed(1)}K</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="ml-[10rem] flex items-center gap-8">
                            {[...hotPairs, ...hotPairs].slice(20, 30).map((pair, index) => (
                        <div
                                    key={`${pair.id}-${index + 20}`}
                                    className="flex-shrink-0 w-fit flex items-center gap-2 text-[12px] hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors"
                                >
                                    <Image
                                      src={pair.image || "/static/3717.png"}
                                      alt={pair.symbol}
                                      width={20}
                                      height={20}
                                      className="rounded-full"
                                      style={{ minWidth: 20, minHeight: 20 }}
                                    />
                            <div>
                                        <div className="font-bold text-white">{pair.name.toUpperCase()}</div>
                                        <div className="text-gray-400">${pair.price.toFixed(6)}</div>
                            </div>
                        </div>
                    ))}
                </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default MemeCoinsWidget;