import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type BreadcrumbItem = {
    label: string
    path: string
    icon?: ReactNode
}

type BreadcrumbProps = {
    items: BreadcrumbItem[]
    className?: string
}

const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
    return (
        <nav className={classNames('py-2', className)} aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap">
                <AnimatePresence mode="sync">
                    {items.map((item, index) => (
                        <motion.li
                            key={`${item.label}-${index}`}
                            className="flex items-center"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {index > 0 && (
                                <span className="mx-2 text-gray-400">/</span>
                            )}
                            {item.path ? (
                                <Link
                                    to={item.path}
                                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                                >
                                    {item.icon && (
                                        <span className="mr-1">
                                            {item.icon}
                                        </span>
                                    )}
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="flex items-center text-sm font-medium text-gray-900">
                                    {item.icon && (
                                        <span className="mr-1">
                                            {item.icon}
                                        </span>
                                    )}
                                    {item.label}
                                </span>
                            )}
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ol>
        </nav>
    )
}

export default Breadcrumb
