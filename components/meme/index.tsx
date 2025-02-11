"use client";
import { useEffect, useState } from "react"
import UtilityBar from "./utilityBar"
import Footer from "../common/footer"
import { useSearchParams } from "next/navigation";
import Feed from "./feed";
import NewCreation from "./table/new-creation/table1";
import Completing from "./table/completing/table1";
import Completed from "./table/completed/table1";
import Soaring from "./table/soaring/table1";

export default function Meme() {
    const searchParams = useSearchParams()
    const [switchTabs, setSwitch] = useState('1')
    useEffect(() => {
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
    }, [])


    return (
        <div className='h-[90vh] overflow-hidden'>
            <UtilityBar setSwitch={setSwitch} switchTabs={switchTabs} />
            {
                searchParams.get("tab") == "home" && <Feed switchTabs={switchTabs} />
            }

            {
                searchParams.get("tab") == "new-creation" && <NewCreation />
            }


            {
                searchParams.get("tab") == "completing" && <Completing />
            }

            {
                searchParams.get("tab") == "completed" && <Completed />
            }

            {
                searchParams.get("tab") == "soaring" && <Soaring />
            }

            <Footer />
        </div>
    )
}
