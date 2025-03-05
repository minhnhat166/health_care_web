import type { CommonProps } from '@/@types/common'
import Logo from '@/components/template/Logo'
import Card from '@/components/ui/Card'
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useTransform,
} from 'framer-motion'
import type { PropsWithChildren, ReactElement, ReactNode } from 'react'
import { cloneElement, memo, useEffect, useState } from 'react'

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const cardClasses =
    'w-[90%] sm:w-[400px] md:w-[450px] lg:w-[500px] max-w-full max-h-screen relative z-10 shadow-2xl'
const cardBodyClasses = 'p-4 sm:p-6 md:p-8'
const logoClasses =
    'mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28'

// Create a particle component with softer movement
const Particle = ({ index }: { index: number }) => {
    const size = Math.random() * 3 + 1
    const initialX = Math.random() * 100
    const initialY = Math.random() * 100
    const duration = Math.random() * 25 + 15
    const delay = Math.random() * 3

    return (
        <motion.div
            className="absolute rounded-full bg-white/50"
            style={{
                width: size,
                height: size,
                left: `${initialX}%`,
                top: `${initialY}%`,
                opacity: 0.1 + Math.random() * 0.2,
            }}
            animate={{
                y: [0, -(Math.random() * 40 + 20), 0],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: 'easeInOut',
            }}
        />
    )
}

// Animation variants with smoother transitions
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.15,
            duration: 0.8,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.5,
            when: 'afterChildren',
        },
    },
}

const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.92, rotateX: 7 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        transition: {
            type: 'spring',
            stiffness: 180,
            damping: 12,
            duration: 0.9,
        },
    },
    hover: {
        y: -15,
        scale: 1.03,
        rotateX: 3,
        boxShadow:
            '0 25px 40px -15px rgba(0, 0, 0, 0.25), 0 0 20px rgba(255, 255, 255, 0.3)',
        transition: {
            duration: 0.4,
            type: 'spring',
            stiffness: 300,
        },
    },
    exit: {
        y: 30,
        opacity: 0,
        rotateX: -7,
        transition: { duration: 0.4 },
    },
}

const backgroundVariants = {
    animate: {
        backgroundPosition: ['0% 0%', '100% 100%'],
        transition: {
            duration: 25,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse' as const,
        },
    },
}

const Simple = memo(
    ({ children, content, ...rest }: PropsWithChildren<SimpleProps>) => {
        const [isHovered, setIsHovered] = useState(false)
        const [particles, setParticles] = useState<React.ReactNode[]>([])
        const mouseX = useMotionValue(0)
        const mouseY = useMotionValue(0)

        const rotateX = useTransform(mouseY, [-300, 300], [7, -7])
        const rotateY = useTransform(mouseX, [-300, 300], [-7, 7])

        useEffect(() => {
            // Increase number of particles for more depth
            const newParticles = Array(60)
                .fill(0)
                .map((_, i) => <Particle key={i} index={i} />)
            setParticles(newParticles)
        }, [])

        const handleMouseMove = (e: React.MouseEvent) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2
            mouseX.set(x)
            mouseY.set(y)
        }

        return (
            <AnimatePresence mode="wait">
                <div className="h-full w-full overflow-hidden">
                    <motion.div
                        className="flex flex-col flex-auto items-center justify-center min-w-0 w-full h-full relative"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={containerVariants}
                        onMouseMove={handleMouseMove}
                    >
                        {/* More vibrant and softer gradient background */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600"
                            animate="animate"
                            variants={backgroundVariants}
                            style={{
                                backgroundSize: '250% 250%',
                                opacity: 0.9,
                            }}
                        />

                        {/* Softer background image overlay */}
                        <div className="absolute inset-0 bg-[url('/img/others/auth-side-bg.jpg')] bg-cover opacity-10"></div>

                        {/* More particles with softer appearance */}
                        <div className="absolute inset-0 overflow-hidden">
                            {particles}
                        </div>

                        {/* Enhanced spotlight effect */}
                        <div className="absolute inset-0 bg-radial-gradient from-white/30 to-transparent opacity-50"></div>

                        <motion.div
                            variants={cardVariants}
                            whileHover="hover"
                            onHoverStart={() => setIsHovered(true)}
                            onHoverEnd={() => setIsHovered(false)}
                            style={{
                                rotateX: isHovered ? 0 : rotateX,
                                rotateY: isHovered ? 0 : rotateY,
                                perspective: '1200px',
                                transformStyle: 'preserve-3d',
                            }}
                            className="transform-gpu rounded-2xl"
                        >
                            <Card
                                className={`${cardClasses} backdrop-blur-md bg-white dark:bg-gray-800/95 rounded-2xl overflow-hidden`}
                                bodyClass={`${cardBodyClasses} relative z-10`}
                            >
                                <motion.div
                                    className="text-center mb-4"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 0.6,
                                        type: 'spring',
                                    }}
                                >
                                    <Logo
                                        type="icon"
                                        imgClass={`${logoClasses} mx-auto transition-all duration-300 hover:scale-105`}
                                    />
                                </motion.div>

                                <motion.div
                                    className="text-center space-y-4"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.3,
                                        duration: 0.7,
                                        type: 'spring',
                                    }}
                                >
                                    {content}
                                    {children &&
                                    'type' in (children as ReactElement)
                                        ? cloneElement(
                                              children as ReactElement,
                                              {
                                                  contentClassName:
                                                      'text-center',
                                                  ...rest,
                                              },
                                          )
                                        : children}
                                </motion.div>
                            </Card>
                        </motion.div>
                    </motion.div>
                </div>
            </AnimatePresence>
        )
    },
)

Simple.displayName = 'Simple'

export default Simple
