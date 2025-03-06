import React from 'react'
import { motion } from 'framer-motion'

const menuItemVariants = {
    hidden: {
        opacity: 0,
        x: -10,
    },
    visible: (custom: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: custom * 0.1,
            duration: 0.3,
            ease: 'easeInOut',
        },
    }),
}

interface AnimatedVerticalMenuItemProps {
    index: number
    children: React.ReactNode
}

const AnimatedVerticalMenuItem: React.FC<AnimatedVerticalMenuItemProps> = ({
    children,
    index,
}) => {
    return (
        <motion.div
            custom={index}
            initial="hidden"
            animate="visible"
            variants={menuItemVariants}
        >
            {children}
        </motion.div>
    )
}

export default AnimatedVerticalMenuItem
