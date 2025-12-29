import { Logo } from "./Logo";
import type { Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { NavbarScroll } from "@/components/NavbarScroll";
import { MobileMenuDrawer } from "@/components/MobileMenuDrawer";
import Link from "next/link";

type NavbarProps = {
  menu: Content.MenuDocument;
};

export const Navbar = ({ menu }: NavbarProps) => {
  return (
    <NavbarScroll>
      <div className="mx-auto w-full max-w-8xl relative z-20 px-6 py-5">
        <div className="flex items-center justify-between gap-8">
          <Link href="/" className="flex items-center gap-4 shrink-0">
            <Logo height={32} width={32} />
            <h3 className="text-tussok text-3xl font-bold">
              Ciudadanías <span className="font-normal">360</span>
            </h3>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-10"
          >
            <SliceZone slices={menu.data.slices} components={components} />
          </nav>

          <MobileMenuDrawer className="shrink-0">
            <SliceZone slices={menu.data.slices} components={components} />
          </MobileMenuDrawer>
        </div>
      </div>
    </NavbarScroll>
  );
};
