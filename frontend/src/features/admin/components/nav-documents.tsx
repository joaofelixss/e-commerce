// frontend/components/nav-documents.tsx
"use client";

import { type LucideIcon, ChevronDown, ChevronUp } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useState } from "react";

interface NavDocumentItem {
  name: string;
  url: string;
  icon: LucideIcon;
  submenu?: {
    title: string;
    url: string;
  }[];
}

interface NavDocumentsProps {
  items: NavDocumentItem[];
}

export function NavDocuments({ items }: NavDocumentsProps) {
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {items.length > 0 && (
          <>
            <h3 className="mb-2 px-2 text-sm font-semibold tracking-tight">
              Documentos
            </h3>
            <SidebarMenu>
              {items.map((item) => (
                <div key={item.name}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip={item.name}
                      className="flex items-center w-full justify-between"
                      onClick={() => item.submenu && toggleSubmenu(item.name)}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center w-full"
                      >
                        {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                        <span>{item.name}</span>
                      </Link>
                      {item.submenu &&
                        (openSubmenus[item.name] ? (
                          <ChevronUp className="h-4 w-4 ml-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-2" />
                        ))}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {item.submenu &&
                    openSubmenus[item.name] &&
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
          </>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
