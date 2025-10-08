'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Smartphone, Monitor, Tablet, HelpCircle, LucideIcon } from 'lucide-react';

interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

const Upadatanav: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const pathname = usePathname();

    const toggleMenu = (): void => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Function to check if link is active
    const isActiveLink = (path: string): boolean => {
        return pathname === path;
    };

    const navItems: NavItem[] = [
        { name: 'iPhone', href: '/deshboard/updata/iphonupdata', icon: Smartphone },
        { name: 'Mac', href: '/deshboard/updata/macupdata', icon: Monitor },
        { name: 'iPad', href: '/deshboard/updata/ipadupdata', icon: Tablet }
    ];

    return (
        <nav className="bg-white shadow-md border-b border-gray-200 w-full">
            <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    {/* Logo/Brand (optional - currently empty) */}
                    <div className="flex-shrink-0 md:hidden">
                        {/* Add logo here if needed */}
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-4 lg:space-x-8 flex-1">
                        {navItems.map((item: NavItem) => {
                            const Icon = item.icon;
                            return (
                                <Link 
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                        isActiveLink(item.href)
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-800 hover:text-blue-600'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Support Link */}
                    <div className="hidden md:flex items-center">
                        <Link 
                            href="/support"
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                isActiveLink('/support')
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-800 hover:text-blue-600'
                            }`}
                        >
                            <HelpCircle className="h-4 w-4" />
                            <span>Support</span>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden ml-auto">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-800 hover:text-blue-600 focus:outline-none focus:text-blue-600 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                            type="button"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pb-3">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg">
                            {navItems.map((item: NavItem) => {
                                const Icon = item.icon;
                                return (
                                    <Link 
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                                            isActiveLink(item.href)
                                                ? 'text-blue-600 bg-blue-100'
                                                : 'text-gray-800 hover:text-blue-600 hover:bg-gray-100'
                                        }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                            <Link 
                                href="/support"
                                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                                    isActiveLink('/support')
                                        ? 'text-blue-600 bg-blue-100'
                                        : 'text-gray-800 hover:text-blue-600 hover:bg-gray-100'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <HelpCircle className="h-5 w-5" />
                                <span>Support</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Upadatanav;