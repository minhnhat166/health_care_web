import { FaRegUser } from 'react-icons/fa'
import { GiMedicines } from 'react-icons/gi'
import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineHome,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
} from 'react-icons/hi'
import { LuLayoutDashboard } from 'react-icons/lu'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    dashboard: <LuLayoutDashboard />,
    drug: <GiMedicines />,
    user: <FaRegUser />,
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
}

export default navigationIcon
