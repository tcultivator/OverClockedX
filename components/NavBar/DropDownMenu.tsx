"use client";
import React from 'react'
import { useState } from 'react';
import {NavigationMenu,NavigationMenuContent,NavigationMenuItem,NavigationMenuLink,NavigationMenuList,NavigationMenuTrigger} from "@/components/ui/navigation-menu"
import { useRouter } from 'next/navigation';
const DropDownMenu = () => {
    const router = useRouter();
    const Computer = ['Desktop', 'Laptop']
    const Components = ['PcCase', 'CPU', 'Motherboard', 'Memory', 'Storage', 'GPU', 'PowerSupply']
    const Peripherals = ['Monitor', 'KeyBoard', 'Mouse', 'HeadPhone', 'Microphone']
    const Networks = ['Router', 'Switch']
    function SelectCategories(category: string): void {
        router.push(`/categories/${category}`);
    }
    const [sideBar, setSideBar] = useState(false)

    return (
        <>
            <div id="DropDownMenu"
                className={`${sideBar ? 'absolute flex flex-col gap-1 top-0 right-0 bg-[#272727] p-[20px] h-[300px] pt-[70px] z-40' : 'hidden'} lg:flex gap-4 `}
                style={{ transition: 'transform 1.6s ease-in-out' }}>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className='py-0'>Computers</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <NavigationMenuLink onClick={() => SelectCategories('Computers')}>All</NavigationMenuLink>
                                {Computer.map((cpn, index) => (
                                    <NavigationMenuLink onClick={() => SelectCategories(cpn)} key={index}>{cpn}</NavigationMenuLink>
                                ))}
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className=''>Components</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <NavigationMenuLink onClick={() => SelectCategories('Components')}>All</NavigationMenuLink>
                                {Components.map((cpn, index) => (
                                    <NavigationMenuLink onClick={() => SelectCategories(cpn)} key={index}>{cpn}</NavigationMenuLink>
                                ))}
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className=''>Peripherals</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <NavigationMenuLink onClick={() => SelectCategories('Peripherals')}>All</NavigationMenuLink>
                                {Peripherals.map((cpn, index) => (
                                    <NavigationMenuLink onClick={() => SelectCategories(cpn)} key={index}>{cpn}</NavigationMenuLink>
                                ))}
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className=''>Networks</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <NavigationMenuLink onClick={() => SelectCategories('Networks')}>All</NavigationMenuLink>
                                {Networks.map((cpn, index) => (
                                    <NavigationMenuLink onClick={() => SelectCategories(cpn)} key={index}>{cpn}</NavigationMenuLink>
                                ))}
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            <div onClick={() => {
                setSideBar(prev => !prev)
                console.log('eto ung sidebar')
            }} className={`flex flex-col gap-1 cursor-pointer ${sideBar? 'absolute px-5':'px-0'} lg:hidden z-50 `}>
                <div

                    className={`bg-white rounded w-[15px] h-[2px] transition duration-200 ${sideBar ? 'absolute rotate-45' : 'relative rotate-0'}`}></div>
                <div

                    className={`bg-white rounded w-[15px] h-[2px] transition duration-200 ${sideBar ? 'absolute rotate-135' : 'relative rotate-0'}`}></div>
            </div>

        </>



    )
}

export default DropDownMenu
