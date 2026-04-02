"use client";

import { Gamepad, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export type NavigationSection = {
  title: string;
  href: string;
};

type HeaderProps = {
  navigationData: NavigationSection[];
  className?: string;
};

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/" || pathname === "";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClassName(active: boolean) {
  return cn(
    "relative inline-flex items-center rounded-lg px-3 py-2 text-base font-medium transition-all duration-200",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    active
      ? "bg-primary/12 text-primary shadow-sm ring-1 ring-primary/20"
      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
  );
}

const Header = ({ navigationData, className }: HeaderProps) => {
  const pathname = usePathname() ?? "";

  return (
    <header
      className={cn("bg-background sticky top-0 z-50 h-16 border-b", className)}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Gamepad className="size-8 rounded-full bg-primary p-1 font-bold text-accent-foreground" />
        </Link>

        <NavigationMenu className="max-md:hidden" viewport={false}>
          <NavigationMenuList className="flex-wrap justify-start gap-1">
            {navigationData.map((navItem) => {
              const active = isNavActive(pathname, navItem.href);
              return (
                <NavigationMenuItem key={navItem.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={navItem.href}
                      className={navLinkClassName(active)}
                      aria-current={active ? "page" : undefined}
                    >
                      {navItem.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex gap-4 max-md:hidden">
          <Button className="rounded-lg" asChild>
            <Link href="/auth/sign-in">Login</Link>
          </Button>
          <Button className="rounded-lg" variant="outline" asChild>
            <Link href="/auth/sign-up">Register</Link>
          </Button>
        </div>

        <div className="flex gap-4 md:hidden">
          <div className="flex gap-4">
            <Button className="rounded-lg" asChild>
              <Link href="/auth/sign-in">Login</Link>
            </Button>
            <Button className="rounded-lg md:hidden" variant="outline" asChild>
              <Link href="/auth/sign-up">Register</Link>
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MenuIcon />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              {navigationData.map((item) => {
                const active = isNavActive(pathname, item.href);
                return (
                  <DropdownMenuItem key={item.title} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "cursor-pointer",
                        active &&
                          "bg-primary/10 font-semibold text-primary focus:bg-primary/15 focus:text-primary",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
