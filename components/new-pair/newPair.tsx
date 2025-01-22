"use client";
import { useState } from "react"
import UtilityBar from "./utilityBar"
import Feed from "./feed"
import Footer from "../common/footer"

export default function NewPage() {
    const [switchTabs, setSwitch] = useState('1')
    return (
      <div className='h-[90vh] overflow-hidden'>
        <UtilityBar  setSwitch={setSwitch} switchTabs={switchTabs}/>
        <Feed switchTabs={switchTabs}/>
        <Footer />
      </div>
    )
  }
  