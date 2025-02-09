import React from 'react';
import { motion } from 'framer-motion';

const MEME_COINS = [
    { id: 1, name: 'Dogecoin', logo: '🐶' },
    { id: 2, name: 'Shiba Inu', logo: '🐕' },
    { id: 3, name: 'Pepe', logo: '🐸' },
    { id: 4, name: 'Bonk', logo: '🏏' },
    { id: 5, name: 'Floki Inu', logo: '🚢' },
    { id: 6, name: 'Samoyedcoin', logo: '🐩' },
    { id: 7, name: 'MonaCoin', logo: '😺' },
    { id: 8, name: 'ElonMogus', logo: '🚀' },
    { id: 9, name: 'WifHat', logo: '🐶' },
    { id: 10, name: 'Kabosu', logo: '🐾' }
];
function MemeCoinsWidget() {
    return (
        <div className="overflow-hidden w-full h-[35px]">
            <div
                className="flex animate-slide gap-12 px-4"
            // animate={{
            //     x: [0, -1 * (MEME_COINS.length * 220)],
            //     transition: {
            //         x: {
            //             repeat: Infinity,
            //             duration: 15,
            //             ease: "linear"
            //         }
            //     }
            // }}
            >
                {/* {[...MEME_COINS, ...MEME_COINS].map((coin) => (
                    <div
                        key={`${coin.id}-${Math.random()}`}
                        className="flex-shrink-0 w-fit flex items-center gap-2 text-[12px]"
                    >
                        <div className="text-2xl">{coin.logo}</div>
                        <div>
                            <span className="font-bold mr-2">#{coin.id}</span>
                            <span>{coin.name}</span>
                        </div>
                    </div>
                ))} */}
                <div className="ml-[5rem] flex items-center gap-3">
                    {[...MEME_COINS].map((coin) => (
                        <div
                            key={`${coin.id}-${Math.random()}`}
                            className="flex-shrink-0 w-fit flex items-center gap-2 text-[12px]"
                        >
                            <div className="text-2xl">{coin.logo}</div>
                            <div>
                                <span className="font-bold mr-2">#{coin.id}</span>
                                <span>{coin.name}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="ml-[10rem] flex items-center gap-8">
                    {[...MEME_COINS].map((coin) => (
                        <div
                            key={`${coin.id}-${Math.random()}`}
                            className="flex-shrink-0 w-fit flex items-center gap-2 text-[12px]"
                        >
                            <div className="text-2xl">{coin.logo}</div>
                            <div>
                                <span className="font-bold mr-2">#{coin.id}</span>
                                <span>{coin.name}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="ml-[10rem] flex items-center gap-8">
                    {[...MEME_COINS].map((coin) => (
                        <div
                            key={`${coin.id}-${Math.random()}`}
                            className="flex-shrink-0 w-fit flex items-center gap-2 text-[12px]"
                        >
                            <div className="text-2xl">{coin.logo}</div>
                            <div>
                                <span className="font-bold mr-2">#{coin.id}</span>
                                <span>{coin.name}</span>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
}

export default MemeCoinsWidget;