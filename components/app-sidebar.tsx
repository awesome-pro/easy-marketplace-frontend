"use client"

import * as React from "react"
import {
  IconCamera,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconListDetails,
  IconSettings,
  IconUsers,
  IconCoin,
  IconChartBar,
  IconBuildingWarehouse,
  IconUser,
  IconMapDollar,
} from "@tabler/icons-react"
import { useAuthContext } from "@/providers/auth-provider"
import { UserRole } from "@/types"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"

// Define navigation items with role-based access
const navItems = {
  // Common items for all roles
  common: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      roles: [UserRole.ISV, UserRole.RESELLER, UserRole.DISTRIBUTOR, UserRole.BUYER, UserRole.ADMIN],
    },
  ],
  
  isv: [
    {
      title: "Listings",
      url: "/dashboard/listings",
      icon: IconListDetails,
      roles: [UserRole.ISV, UserRole.ADMIN],
    },
    {
      title: "Offers",
      url: "/dashboard/offers",
      icon: IconMapDollar,
      roles: [UserRole.ISV, UserRole.ADMIN],
    },
    {
      title: "Agreements",
      url: "/dashboard/agreements",
      icon: IconMapDollar,
      roles: [UserRole.ISV, UserRole.ADMIN],
    },
    {
      title: "Disbursements",
      url: "/dashboard/disbursements",
      icon: IconCoin,
      roles: [UserRole.ISV, UserRole.ADMIN],
    },
    {
      title: "Resellers",
      url: "/dashboard/resellers",
      icon: IconUsers,
      roles: [UserRole.ISV, UserRole.ADMIN],
    },
    {
      title: "Resale Authorizations",
      url: "/dashboard/resale-authorizations",
      icon: IconUsers,
      roles: [UserRole.ISV],
    },
    // {
    //   title: "Distributors",
    //   url: "/dashboard/distributors",
    //   icon: IconBuildingWarehouse,
    //   roles: [UserRole.ISV, UserRole.ADMIN],
    // },
    
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartBar,
      roles: [UserRole.ISV, UserRole.ADMIN],
    },
  ],
  
  // Reseller specific items
  reseller: [
    {
      title: "Listings",
      url: "/dashboard/listings",
      icon: IconListDetails,
      roles: [UserRole.RESELLER],
    },

    {
      title: "Offers",
      url: "/dashboard/offers",
      icon: IconMapDollar,
      roles: [UserRole.RESELLER],
    },
    {
      title: "Disbursements",
      url: "/dashboard/disbursements",
      icon: IconCoin,
      roles: [UserRole.RESELLER],
    },  
    {
      title: "Resale Authorizations",
      url: "/dashboard/resale-authorizations",
      icon: IconUsers,
      roles: [UserRole.RESELLER],
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartBar,
      roles: [UserRole.RESELLER],
    },
    {
      title: "Discovery",
      url: "/dashboard/discovery",
      icon: IconListDetails,
      roles: [UserRole.RESELLER],
    },
  ],
  
  // Distributor specific items
  distributor: [
    {
      title: "Network",
      url: "/dashboard/network",
      icon: IconListDetails,
      roles: [UserRole.DISTRIBUTOR],
    },
    {
      title: "ISVs",
      url: "/dashboard/network/isvs",
      icon: IconUsers,
      roles: [UserRole.DISTRIBUTOR],
    },
    // {
    //   title: "Disbursements",
    //   url: "/dashboard/disbursements",
    //   icon: IconCoin,
    //   roles: [UserRole.DISTRIBUTOR],
    // },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartBar,
      roles: [UserRole.DISTRIBUTOR],
    },
    {
      title: "Matches",
      url: "/dashboard/matches",
      icon: IconListDetails,
      roles: [UserRole.DISTRIBUTOR],
    },
  ],
  
  // Buyer specific items
  buyer: [
    {
      title: "Offers",
      url: "/dashboard/offers",
      icon: IconListDetails,
      roles: [UserRole.BUYER, UserRole.ADMIN],
    },
    {
      title: "Agreements",
      url: "/dashboard/agreements",
      icon: IconFileWord,
      roles: [UserRole.BUYER, UserRole.ADMIN],
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconCoin,
      roles: [UserRole.BUYER],
    },
  ],
  
  // Admin specific items
  admin: [
    {
      title: "ISVs",
      url: "/dashboard/isvs",
      icon: IconCoin,
      roles: [UserRole.ISV, UserRole.ADMIN],
    },
    {
      title: "Offers",
      url: "/dashboard/offers",
      icon: IconListDetails,
      roles: [UserRole.ADMIN],
    },
    {
      title: "Agreements",
      url: "/dashboard/agreements",
      icon: IconFileWord,
      roles: [UserRole.ADMIN],
    },
  ],
};

const data = {
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: IconUser
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: IconHelp,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthContext();
  
  // Generate navigation items based on user role
  const getNavItems = () => {
    if (!user) return [];
    
    // Start with common items
    let items = [...navItems.common];
    
    // Add role-specific items
    switch (user.role) {
      case UserRole.ISV:
        items = [...items, ...navItems.isv];
        break;
      case UserRole.RESELLER:
        items = [...items, ...navItems.reseller];
        break;
      case UserRole.DISTRIBUTOR:
        items = [...items, ...navItems.distributor];
        break;
      case UserRole.BUYER:
        items = [...items, ...navItems.buyer];
        break;
      case UserRole.ADMIN:
        // Admin gets access to all navigation items
        items = [
          ...items,
          ...navItems.isv,
          ...navItems.admin,
        ];
        break;
      default:
        // Default to just common items
        break;
    }
    
    return items;
  };
  
  const roleBasedNavItems = getNavItems();
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <Image src="/logo1.png" alt="EasyMarketplace" width={100} height={100} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={roleBasedNavItems} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
