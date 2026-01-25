"use client";
import React from 'react'
import { useState } from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic'
import { useSideBarStore } from '@/stores/sideBarStore';
import { Label } from '../ui/label';
export const DropDownMenu = dynamic(() => import('@/components/NavBar/DropDownMenu'), {
    ssr: false,
})

const HeaderDropDown = () => {
    const router = useRouter();
    const Computer = ['Desktop', 'Laptop']
    const Components = ['PcCase', 'CPU', 'Motherboard', 'Memory', 'Storage', 'GPU', 'PowerSupply']
    const Peripherals = ['Monitor', 'KeyBoard', 'Mouse', 'HeadPhone', 'Microphone']
    const Networks = ['Router', 'Switch']

    const sideBar = useSideBarStore((state) => state.sideBar)
    const setSideBar = useSideBarStore((state) => state.setSideBar)
    function SelectCategories(category: string): void {
        
        if (window.innerWidth < 768) {
            setSideBar()
        }
        router.push(`/categories/${category}`);
    }


    return (
        <>
            <div id="DropDownMenu"
                className={`${sideBar ? 'absolute justify-between flex flex-col gap-1 top-10 left-0 bg-white p-[10px] py-[40px] h-[97vh] w-full z-30' : 'hidden'} md:flex gap-4 `}
                style={{ transition: 'transform 1.6s ease-in-out' }}>
                <div className={`${sideBar ? 'flex flex-col ' : 'hidden'} md:flex gap-4 `}>
                    <div className='w-full border-b border-black/20 py-2'>
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={`py-0 text-black font-orbitron  uppercase`}>Computers</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <NavigationMenuLink className='' onClick={() => SelectCategories('Computers')}>All</NavigationMenuLink>
                                        {Computer.map((cpn, index) => (
                                            <NavigationMenuLink className='' onClick={() => SelectCategories(cpn)} key={index}>{cpn}</NavigationMenuLink>
                                        ))}
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <div className='w-full border-b border-black/20 py-2'>
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className='text-black font-orbitron  uppercase'>Components</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <NavigationMenuLink className='' onClick={() => SelectCategories('Components')}>All</NavigationMenuLink>
                                        {Components.map((cpn, index) => (
                                            <NavigationMenuLink className='' onClick={() => SelectCategories(cpn)} key={index}>{cpn}</NavigationMenuLink>
                                        ))}
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <div className='w-full border-b border-black/20 py-2'>
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className='text-black font-orbitron uppercase'>Peripherals</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <NavigationMenuLink className='' onClick={() => SelectCategories('Peripherals')}>All</NavigationMenuLink>
                                        {Peripherals.map((cpn, index) => (
                                            <NavigationMenuLink className='' onClick={() => SelectCategories(cpn)} key={index}>{cpn}</NavigationMenuLink>
                                        ))}
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <div className='w-full border-b border-black/20 py-2'>
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className='text-black font-orbitron  uppercase'>Networks</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <NavigationMenuLink className='' onClick={() => SelectCategories('Networks')}>All</NavigationMenuLink>
                                        {Networks.map((cpn, index) => (
                                            <NavigationMenuLink className='' onClick={() => SelectCategories(cpn)} key={index}>{cpn}</NavigationMenuLink>
                                        ))}
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                </div>
                <div className='md:hidden text-black w-full flex flex-col border-t border-black/20 py-2 font-orbitron'>
                    <Label className='p-2 px-3 uppercase'>Signin</Label>
                </div>

            </div>

        </>



    )
}

export default HeaderDropDown
