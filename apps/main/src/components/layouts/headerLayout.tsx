"use client"
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

const NavBar = () => {
  const { t } = useTranslation("header")
  return (
    <div className="nav-bar text-white ml-[8vw]">
      <div className="nav-bar-item cursor-pointer">
        <Link href="/" className="nav-bar-item-text">{t("home")}</Link>
        <Link href="/cti-market" className="nav-bar-item-text">{t("ctiMarket")}</Link>
        {/* <Link to="/knowledge-plane" className="nav-bar-item-text">{t("knowledgePlane")}</Link> */}
        <Link href="/block-browser" className="nav-bar-item-text">{t("blockBrowser")}</Link>
      </div>
    </div>
  )
}

export const HeaderLayout = () => {
  const { t } = useTranslation("header")
  return (
    <header>
      <div className="header-container bg-header-500 p-5 text-[16px] text-center">
        <div className="header-title w-auto cursor-pointer" onClick={() => {
          window.location.href = "/"
        }}>
          {/* <span className="ml-[8vw] text-header-logo-500">B&R</span> */}
          <span className="ml-[8vw] text-header-logo-500">ReDoS</span>
          <span className="ml-[5px] text-white">{t("a cti sharing platform")}</span>
        </div>
        <NavBar />
      </div>
    </header>
  )
}

export default HeaderLayout;
