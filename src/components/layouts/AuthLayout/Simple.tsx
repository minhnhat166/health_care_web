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
    'w-[90%] max-w-[400px] sm:w-[380px] md:w-[420px] lg:w-[480px] xl:w-[520px] relative z-10 shadow-2xl mx-auto'
const cardBodyClasses = 'py-4 px-4 sm:px-6 md:p-8'
const logoClasses =
    'mx-auto w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24'

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
        const [isMobile, setIsMobile] = useState(false)
        const [viewportHeight, setViewportHeight] = useState(0)

        const rotateX = useTransform(mouseY, [-300, 300], [7, -7])
        const rotateY = useTransform(mouseX, [-300, 300], [-7, 7])

        useEffect(() => {
            const particleCount = window.innerWidth < 768 ? 20 : 60
            const newParticles = Array(particleCount)
                .fill(0)
                .map((_, i) => <Particle key={i} index={i} />)
            setParticles(newParticles)

            const checkMobileAndHeight = () => {
                setIsMobile(window.innerWidth < 768)
                setViewportHeight(window.innerHeight)
            }

            checkMobileAndHeight()
            window.addEventListener('resize', checkMobileAndHeight)

            if ('visualViewport' in window) {
                window.visualViewport?.addEventListener(
                    'resize',
                    checkMobileAndHeight,
                )
            }

            return () => {
                window.removeEventListener('resize', checkMobileAndHeight)
                if ('visualViewport' in window) {
                    window.visualViewport?.removeEventListener(
                        'resize',
                        checkMobileAndHeight,
                    )
                }
            }
        }, [])

        const handleMouseMove = (e: React.MouseEvent) => {
            if (isMobile) return

            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2
            mouseX.set(x)
            mouseY.set(y)
        }

        const containerStyle = {
            minHeight: isMobile ? `${viewportHeight}px` : '100%',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
        }

        return (
            <AnimatePresence mode="wait">
                <div
                    className="h-full w-full overflow-hidden flex justify-center"
                    style={containerStyle}
                >
                    <motion.div
                        className="flex flex-col flex-auto items-center justify-center min-w-0 w-full h-full relative"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={containerVariants}
                        onMouseMove={handleMouseMove}
                        style={{
                            height: isMobile ? `${viewportHeight}px` : '100%',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600"
                            animate="animate"
                            variants={backgroundVariants}
                            style={{
                                backgroundSize: '250% 250%',
                                opacity: 0.9,
                            }}
                        />

                        <div className="absolute inset-0 bg-[url('/img/others/auth-side-bg.jpg')] bg-cover opacity-10"></div>

                        <div className="absolute inset-0 overflow-hidden">
                            {particles}
                        </div>

                        <div className="absolute inset-0 bg-radial-gradient from-white/30 to-transparent opacity-50"></div>

                        <motion.div
                            variants={cardVariants}
                            whileHover={isMobile ? undefined : 'hover'}
                            onHoverStart={() => !isMobile && setIsHovered(true)}
                            onHoverEnd={() => !isMobile && setIsHovered(false)}
                            style={{
                                rotateX: isHovered || isMobile ? 0 : rotateX,
                                rotateY: isHovered || isMobile ? 0 : rotateY,
                                perspective: '1200px',
                                transformStyle: 'preserve-3d',
                            }}
                            className="transform-gpu rounded-2xl my-4 flex justify-center w-full md:w-fit transition-transform duration-300"
                        >
                            <Card
                                className={`${cardClasses} backdrop-blur-md bg-white dark:bg-gray-800/95 rounded-xl md:rounded-2xl overflow-hidden`}
                                bodyClass={`${cardBodyClasses} relative z-10`}
                            >
                                <motion.div
                                    className="text-center mb-3 sm:mb-4"
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
                                    className="text-center space-y-3 sm:space-y-4"
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
