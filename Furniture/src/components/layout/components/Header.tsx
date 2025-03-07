import MainNavBar from "./MainNavBar"
import { siteConfig } from "@/configs/site"
import MobileNavBar from "./MobileNavBar"

const Header = () => {
  return (
    <header className="flex items-center border-b border-b-slate-300 h-16">
      <MainNavBar items={siteConfig.mainNav} />
      <MobileNavBar items={siteConfig.mainNav} />
    </header>
  )
}

export default Header
