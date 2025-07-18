"use client";
import { useEffect, useState } from "react"
import UtilityBar from "./utilityBar"
import Feed from "./feed"
import Footer from "../common/footer"
import Table from "./table/table1";
import { useSearchParams } from "next/navigation";
import Trending from "../trending";

export default function Meme() {
    const searchParams = useSearchParams();
    const [switchTabs, setSwitch] = useState(searchParams?.get("tab") || '1');
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (window.innerWidth < 768) {
            setSwitch("2")
        }
        const resize = () => {
            if (window.innerWidth < 768) {
                setSwitch("2")
            } else if (window.innerWidth > 768) {
                setSwitch("1")
            }
        }
        window.addEventListener("resize", resize)
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [mounted])

    // Wait for client mount before rendering
    if (!mounted) return null;

    if (isMobile) {
        return <Trending />;
    }

    return (
        <div className='h-[90vh] overflow-hidden'>
            <UtilityBar switchTabs={switchTabs} />
            {
                switchTabs == '1' ?
                    <Table /> :
                    <Feed />
            }
            <Footer />
        </div>
    )
}
