"use client";

import * as React from "react";
import {
  CreditCard,
  Layers,
  Package,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar(props) {
  const [firstname, setFirstname] = React.useState("");
  const [emailUser, setEmailUser] = React.useState("");

  React.useEffect(() => {
    const dataString = localStorage.getItem("data");
    if (dataString) {
      const data = JSON.parse(dataString);
      setFirstname(data.firstname || "");
      setEmailUser(data.email || "");
    }
  }, []);

  const appData = {
    user: {
      name: firstname,
      email: emailUser,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Astro Market",
        logo: ShoppingCart,
        plan: "E-commerce",
      },
    ],
    navMain: [
      {
        title: "Products",
        url: "/products",
        icon: Package, 
        isActive: true,
        items: [
          { title: "View All Products", url: "/dashboard/products" },
          { title: "View All Not Approved Products", url: "/dashboard/notApprovedProducts" },
        ],
      },
      {
        title: "Categories",
        url: "#",
        icon: Layers, 
        items: [{ title: "View All categories", url: "/dashboard/categories" }],
      },
     
      {
        title: "Reviews",
        url: "#",
        icon: Star, 
        items: [{ title: "View Reviews", url: "/dashboard/reviews" }],
      }
    ],
  };

  return (
    <Sidebar collapsible {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={appData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={appData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={appData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
