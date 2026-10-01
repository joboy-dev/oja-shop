import Logo from "./Logo"

const footerLinks = [
  {
    heading: "Product",
    links: [
      { name: "Projects", href: "#" },
      { name: "Features", href: "#" },
      { name: "Pricing", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Blog", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Security", href: "#" },
    ],
  },
];

function Footer() {
  return (
    <footer className="w-full min-h-[80px] bg-background page-padding">
      <div className="flex max-md:flex-col gap-5 items-center justify-between w-full max-md:items-start">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="text-muted-foreground text-sm max-w-3xs">
            The central ecosystem for digital healthcare innovation.
          </p>
        </div>

        <div className="flex items-start gap-20 max-md:gap-8 max-md:w-full max-md:justify-between max-md:flex-col">
          {footerLinks.map((section) => (
            <div key={section.heading} className="flex flex-col gap-2">
              <span className="font-bold text-xs uppercase text-foreground mb-2 tracking-wider">{section.heading}</span>
              <ul className="flex flex-col gap-1">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="h-0.5 w-full bg-muted my-5"></div>

      <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Medstaq Technologies. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer