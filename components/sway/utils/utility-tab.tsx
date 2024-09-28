"use client"

import { Suspense, lazy, useState } from "react"

import { cn } from "@/lib/utils"
import { Title } from "@/components/core/components/title"

interface UtiltyTabProps extends React.HTMLAttributes<HTMLDivElement> { }

enum Tab {
  B256CONVERT = "B56 Conversion",
  SIGNMSG = "Sign Message",
  RANDB56 = "Random B256",
}

const Lazyb256Conversion = lazy(
  () => import("@/components/sway/utils/b256-conversion")
)
const LazySignMessage = lazy(() => import("@/components/sway/utils/sign-message"))
const LazyRandomB56 = lazy(() => import("@/components/sway/utils/random-b256"))

export function UtiltyTab({ className }: UtiltyTabProps) {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.B256CONVERT)

  const isActive = (tab: Tab) => activeTab === tab

  const tabActive = (tab: Tab) =>
    cn("cursor-pointer", {
      "text-grayscale-250": !isActive(tab),
      "bg-grayscale-200 rounded-lg px-3 py-1": isActive(tab),
    })

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab)
  }

  return (
    <div className={cn("px-2 pb-4", className)}>
      <Title text="Utility" />

      <div className="mx-2 my-4 flex items-center gap-x-4 overflow-auto text-sm">
        <div
          className={tabActive(Tab.B256CONVERT)}
          onClick={() => handleTabClick(Tab.B256CONVERT)}
        >
          B256 Converter
        </div>
        <div
          className={tabActive(Tab.SIGNMSG)}
          onClick={() => handleTabClick(Tab.SIGNMSG)}
        >
          Sign Message
        </div>
        <div
          className={tabActive(Tab.RANDB56)}
          onClick={() => handleTabClick(Tab.RANDB56)}
        >
          Random B256
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        {isActive(Tab.B256CONVERT) && <Lazyb256Conversion />}
        {isActive(Tab.SIGNMSG) && <LazySignMessage />}
        {isActive(Tab.RANDB56) && <LazyRandomB56 />}
      </Suspense>
    </div>
  )
}
