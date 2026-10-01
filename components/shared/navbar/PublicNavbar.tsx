'use client'

import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Logo from '../Logo';
import LinkButton from '../button/LinkButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  // { label: 'Home', to: '/' },
  // { label: 'About', to: '/about' },
  // { label: 'Projects', to: '/projects' },
  // { label: 'Blog', to: '/blog' },
] as any[];

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = usePathname();

  return (
    <header className="bg-background w-full border-b border-primary/10 backdrop-blur supports-xbackdrop-filter:bg-background/90 fixed top-0 z-10">
      <div className="flex items-center justify-between nav-padding">
        <Logo/>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={clsx(
                "hover:text-primary text-lg",
                location===item.to ? "text-primary" : ""
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div>
          {/* <LinkButton
            to="/contact"
            size='sm'
            variant='primary'
            className="max-md:hidden font-bold"
          >
            Let's Talk
            <ArrowUpRight className='h-4 w-4 ml-5'/>
          </LinkButton> */}

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden text-foreground"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 bg-background shadow-md nav-padding">
          <div className='flex flex-col gap-4'>
            {navItems.map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    "hover:text-primary text-lg",
                    "block py-2 text-foreground hover:text-primary text-left",
                    location===item.to ? "text-primary" : ""
                  )}
                >
                  {item.label}
                </Link>
            ))}
            {/* <LinkButton
              to="/contact"
              variant='outline'
              className='w-48 mb-5 font-bold'
            >
              Let's Talk
              <ArrowUpRight className='h-4 w-4 ml-5'/>
            </LinkButton> */}
          </div>
        </div>
      )}
    </header>
  );
}
