
export default function TableHead() {
    return (
        <>
            <colgroup>
                <col style={{ width: "290px" }} />
                <col style={{ width: "107px" }} />
                <col style={{ width: "131px" }} />
                <col style={{ width: "96px" }} />
                <col style={{ width: "96px" }} />
                <col style={{ width: "96px" }} />
                <col style={{ width: "96px" }} />
                <col style={{ width: "96px" }} />
                <col style={{ width: "96px" }} />
                <col style={{ width: "96px" }} />
                <col style={{ width: "351px" }} />
            </colgroup>

            <thead className="whitespace-nowrap border-b-2">
                <tr className="text-[#c2cccc] font-[300] bg-accent-2 text-[12px] z-[10] sticky top-0">
                <th className="font-[400] py-3 px-2 sticky top-0 left-0 z-10 bg-accent-2">
                    <div className="flex items-center gap-1">
                            <button className="flex items-center gap-1">Token</button>
                            <span>/</span>
                        <button className="flex items-center gap-1">
                                <span>Last Active</span>
                                <span aria-hidden="true">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="8"
                                        height="8"
                                        fill="currentColor"
                                        viewBox="0 0 7 7"
                                    >
                                        <path d="M3.199 2.344a.4.4 0 01.602 0L6.42 5.337A.4.4 0 016.118 6H.882a.4.4 0 01-.302-.663L3.2 2.344z"></path>
                                    </svg>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="8"
                                        height="8"
                                        fill="currentColor"
                                        viewBox="0 0 7 7"
                                    >
                                        <path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path>
                                    </svg>
                                </span>
                        </button>
                    </div>
                </th>

                    <th className="font-[400] py-3 px-2 hidden md:block">
                    <div className="flex items-center gap-1">
                        <button className="flex items-center gap-1">
                            Age
                            <span aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                    <path d="M3.199 2.344a.4.4 0 01.602 0L6.42 5.337A.4.4 0 016.118 6H.882a.4.4 0 01-.302-.663L3.2 2.344z"></path>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                    <path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                </th>
               
                    <th className="font-[400] py-3 px-2">
                        <div className="flex items-center gap-1">
                            <button className="flex items-center gap-1">
                                Liq/Initial
                                <span aria-hidden="true">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                        <path d="M3.199 2.344a.4.4 0 01.602 0L6.42 5.337A.4.4 0 016.118 6H.882a.4.4 0 01-.302-.663L3.2 2.344z"></path>
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                        <path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </th>

                <th className="font-[400] py-3 px-2">
                    <div className="flex items-center gap-1">
                        <button className="flex items-center gap-1">
                                HOLDER
                            <span aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                    <path d="M3.199 2.344a.4.4 0 01.602 0L6.42 5.337A.4.4 0 016.118 6H.882a.4.4 0 01-.302-.663L3.2 2.344z"></path>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                    <path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                </th>

                <th className="font-[400] py-3 px-2">
                    <div className="flex items-center gap-1">
                        <button className="flex items-center gap-1">
                                1m txs
                            <span aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                    <path d="M3.199 2.344a.4.4 0 01.602 0L6.42 5.337A.4.4 0 016.118 6H.882a.4.4 0 01-.302-.663L3.2 2.344z"></path>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                    <path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                </th>

                <th className="font-[400] py-3 px-2">
                    <div className="flex items-center gap-1">
                        <button className="flex items-center gap-1">
                                1m vol
                            <span aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                    <path d="M3.199 2.344a.4.4 0 01.602 0L6.42 5.337A.4.4 0 016.118 6H.882a.4.4 0 01-.302-.663L3.2 2.344z"></path>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                    <path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                </th>

                <th className="font-[400] py-3 px-2">
                    <div className="flex items-center gap-1">
                        <button className="flex items-center gap-1">
                                PRICE
                            <span aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                    <path d="M3.199 2.344a.4.4 0 01.602 0L6.42 5.337A.4.4 0 016.118 6H.882a.4.4 0 01-.302-.663L3.2 2.344z"></path>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                    <path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                </th>

                <th className="font-[400] py-3 px-2">
                    <div className="flex items-center gap-1">
                        <button className="flex items-center gap-1">
                                1h%
                            <span aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                    <path d="M3.199 2.344a.4.4 0 01.602 0L6.42 5.337A.4.4 0 016.118 6H.882a.4.4 0 01-.302-.663L3.2 2.344z"></path>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                    <path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                </th>

                <th className="font-[400] py-3 px-2">
                    <div className="flex items-center gap-1">
                        <button className="flex items-center gap-1">
                                24h%
                            <span aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                    <path d="M3.199 2.344a.4.4 0 01.602 0L6.42 5.337A.4.4 0 016.118 6H.882a.4.4 0 01-.302-.663L3.2 2.344z"></path>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                    <path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                </th>
                    <th className="font-[400] py-2 px-2">
                    <div className="flex items-center gap-1">
                        <button className="flex items-center gap-1">
                                7d%
                            <span aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                    <path d="M3.199 2.344a.4.4 0 01.602 0L6.42 5.337A.4.4 0 016.118 6H.882a.4.4 0 01-.302-.663L3.2 2.344z"></path>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7">
                                    <path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                </th>
                <th className="font-[400] py-2 px-2">
                        <div className="flex flex-col items-center gap-0">
                            <span className="text-xs text-accent-1 mb-0.5">Mini</span>
                    <div className="flex items-center gap-1">
                        <button className="flex items-center gap-1">
                                    Chart
                        </button>
                        <button className="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M2.702 3.225l.006.006 3.635 3.547c.355.346.554.82.554 1.315v3.898a.6.6 0 11-1.2 0V8.093a.636.636 0 00-.192-.456L1.87 4.09C1.088 3.327 1.628 2 2.72 2h10.562c1.093 0 1.633 1.328.85 2.09l-3.64 3.547a.636.636 0 00-.191.456v5.634a.6.6 0 01-1.2 0V8.093c0-.495.2-.97.554-1.315l3.64-3.547.005-.006.001-.002-.002-.012a.03.03 0 00-.007-.01h-.002l-.008-.001H2.71a.03.03 0 00-.006.011.03.03 0 00-.003.012l.001.002z"></path></svg>
                        </button>
                    </div>
                    </div>
                </th>
            </tr>
        </thead>
        </>
    );
}
