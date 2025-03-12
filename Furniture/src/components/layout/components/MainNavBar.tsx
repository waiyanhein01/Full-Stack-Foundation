import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { MainNavItems } from "@/types";
import { Icons } from "../../Icons";
import { siteConfig } from "@/configs/site";
import { Link } from "react-router";

interface MainNavBarProps {
  items?: MainNavItems[];
}
const MainNavBar = ({ items }: MainNavBarProps) => {
  return (
    <header className="items-center hidden lg:flex gap-2">
      <Link to="/" className="flex items-center gap-3">
        <Icons.NavIcon className="size-7" aria-hidden="true" />
        <h1 className="inline-block font-semibold">{siteConfig.name}</h1>
        <span className="sr-only">Home</span>
      </Link>
      <div className="">
        <NavigationMenu>
          <NavigationMenuList>
            {items?.[0]?.card && (
              <NavigationMenuItem>
                <NavigationMenuTrigger>{items[0].title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex size-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-5 no-underline outline-none focus:shadow-md"
                          to="/"
                        >
                          <div className=" flex justify-baseline items-center gap-3 mb-2">
                          <Icons.NavIcon className="size-6" />
                          <div className=" font-medium">
                            {siteConfig.name}
                          </div>
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            {siteConfig.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <div className="">
                      {items[0].card.map((item) => (
                        <ListItem
                          key={item.title}
                          href={item.href}
                          title={item.title}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </div>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
            <div className="flex items-center gap-5">
              {items?.[0]?.menu &&
                items?.[0]?.menu.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <Link to={String(item.href)}>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
            </div>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          to={String(href)}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default MainNavBar;
