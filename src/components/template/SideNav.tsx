import Logo from '@/components/template/Logo'
import VerticalMenuContent from '@/components/template/VerticalMenuContent'
import ScrollBar from '@/components/ui/ScrollBar'
import navigationConfig from '@/configs/navigation.config'
import {
    LOGO_X_GUTTER,
    NAV_MODE_DARK,
    NAV_MODE_THEMED,
    NAV_MODE_TRANSPARENT,
    SIDE_NAV_COLLAPSED_WIDTH,
    SIDE_NAV_CONTENT_GUTTER,
    SIDE_NAV_WIDTH,
} from '@/constants/theme.constant'
import { useAppSelector } from '@/store'
import useResponsive from '@/utils/hooks/useResponsive'
import classNames from 'classnames'
import { motion } from 'framer-motion'

// Animation variants
const sideNavVariants = {
    expanded: {
        width: SIDE_NAV_WIDTH,
        transition: {
            type: 'spring',
            stiffness: 800,
            damping: 45,
            mass: 0.2,
        },
    },
    collapsed: {
        width: SIDE_NAV_COLLAPSED_WIDTH,
        transition: {
            type: 'spring',
            stiffness: 800,
            damping: 45,
            mass: 0.2,
        },
    },
}

const contentVariants = {
    expanded: {
        opacity: 1,
        transition: {
            duration: 0.06,
            ease: 'easeOut',
        },
    },
    collapsed: {
        opacity: 0,
        transition: {
            duration: 0.04,
            ease: 'easeIn',
        },
    },
}

const logoVariants = {
    expanded: {
        x: 0,
        transition: {
            type: 'spring',
            stiffness: 1000,
            damping: 50,
        },
    },
    collapsed: {
        x: 0,
        transition: {
            type: 'spring',
            stiffness: 1000,
            damping: 50,
        },
    },
}

const SideNav = () => {
    const themeColor = useAppSelector((state) => state.theme.themeColor)
    const primaryColorLevel = useAppSelector(
        (state) => state.theme.primaryColorLevel,
    )
    const navMode = useAppSelector((state) => state.theme.navMode)
    const mode = useAppSelector((state) => state.theme.mode)
    const direction = useAppSelector((state) => state.theme.direction)
    const currentRouteKey = useAppSelector(
        (state) => state.base.common.currentRouteKey,
    )
    const sideNavCollapse = useAppSelector(
        (state) => state.theme.layout.sideNavCollapse,
    )
    const userAuthority = useAppSelector((state) => state.auth.user.authority)

    const { larger } = useResponsive()

    const sideNavColor = () => {
        if (navMode === NAV_MODE_THEMED) {
            return `bg-${themeColor}-${primaryColorLevel} side-nav-${navMode}`
        }
        return `side-nav-${navMode}`
    }

    const logoMode = () => {
        if (navMode === NAV_MODE_THEMED) {
            return NAV_MODE_DARK
        }

        if (navMode === NAV_MODE_TRANSPARENT) {
            return mode
        }

        return navMode
    }

    const menuContent = (
        <VerticalMenuContent
            navMode={navMode}
            collapsed={sideNavCollapse}
            navigationTree={navigationConfig}
            routeKey={currentRouteKey}
            userAuthority={userAuthority as string[]}
            direction={direction}
        />
    )

    return (
        <>
            {larger.md && (
                <motion.div
                    initial={sideNavCollapse ? 'collapsed' : 'expanded'}
                    animate={sideNavCollapse ? 'collapsed' : 'expanded'}
                    variants={sideNavVariants}
                    className={classNames(
                        'side-nav',
                        sideNavColor(),
                        !sideNavCollapse && 'side-nav-expand',
                    )}
                >
                    <motion.div
                        className="side-nav-header flex items-center justify-center p-4"
                        variants={logoVariants}
                    >
                        {sideNavCollapse ? null : (
                            <Logo
                                mode={logoMode()}
                                type={sideNavCollapse ? 'streamline' : 'full'}
                                className={classNames(
                                    sideNavCollapse
                                        ? SIDE_NAV_CONTENT_GUTTER
                                        : LOGO_X_GUTTER,
                                )}
                            />
                        )}
                    </motion.div>
                    {sideNavCollapse ? (
                        menuContent
                    ) : (
                        <motion.div
                            className="side-nav-content"
                            initial="collapsed"
                            animate="expanded"
                            variants={contentVariants}
                        >
                            <ScrollBar autoHide direction={direction}>
                                {menuContent}
                            </ScrollBar>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </>
    )
}

export default SideNav
