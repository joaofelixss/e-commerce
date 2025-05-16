// src/components/nav-main.tsx
"use client";

import {
  MailIcon,
  PlusCircleIcon,
  type LucideIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useState } from "react";

interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  submenu?: {
    title: string;
    url: string;
  }[];
}

interface NavMainProps {
  items: NavMainItem[];
}

export function NavMain({ items }: NavMainProps) {
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <PlusCircleIcon className="h-4 w-4" />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              asChild
              size="icon"
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <Link href="#">
                <MailIcon className="h-4 w-4" />
                <span className="sr-only">Inbox</span>
              </Link>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <div key={item.title}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={item.title}
                  className="flex items-center w-full justify-between" // Adicione justify-between
                  onClick={() => item.submenu && toggleSubmenu(item.title)} // Adicione onClick
                >
                  <Link href={item.url} className="flex items-center w-full">
                    {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                    <span>{item.title}</span>
                  </Link>
                  {item.submenu &&
                    (openSubmenus[item.title] ? (
                      <ChevronUp className="h-4 w-4 ml-2" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-2" />
                    ))}
                </SidebarMenuButton>
              </SidebarMenuItem>
              {item.submenu &&
                openSubmenus[item.title] && // Renderize condicionalmente o submenu
                item.submenu.map((subItem) => (
                  <SidebarMenuItem key={subItem.title} className="ml-4">
                    <SidebarMenuButton tooltip={subItem.title} asChild>
                      <Link
                        href={subItem.url}
                        className="flex items-center w-full text-sm text-muted-foreground"
                      >
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </div>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
