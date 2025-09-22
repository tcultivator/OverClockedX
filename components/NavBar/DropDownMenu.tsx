"use client";
import React from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
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
    return (

        <div className='flex justify-start w-max items-center ml-[5%] gap-[20px]'>
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
                        <NavigationMenuTrigger>Components</NavigationMenuTrigger>
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
                        <NavigationMenuTrigger>Peripherals</NavigationMenuTrigger>
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
                        <NavigationMenuTrigger>Networks</NavigationMenuTrigger>
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

    )
}

export default DropDownMenu
