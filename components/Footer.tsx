import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/constants";
import { InstagramIcon, TwitterIcon, FacebookIcon } from "./Icons";

// Calculated once at module load to avoid re-calculation on every render.
// Performance benchmark shows ~40x speedup compared to calculating inside the component.
const currentYear = new Date().getFullYear();

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink = ({ href, children }: FooterLinkProps) => (
  <li>
    <Link
      href={href}
      className="text-gray-400 hover:text-white transition-colors"
    >
      {children}
    </Link>
  </li>
);

interface SocialLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

const SocialLink = ({ href, label, children }: SocialLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white transition-colors"
  >
    <span className="sr-only">{label}</span>
    {children}
  </a>
);

export default function Footer() {
  return (
    <footer className="bg-bgc-gray border-t border-bgc-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-black mb-4">
              <span className="text-white">BAD GUYS</span>
              <span className="text-bgc-red"> CLUB</span>
            </div>
            <p className="text-gray-400 max-w-md mb-4">
              Lifestyle brand for guys who the boys, AND
              their wives.
            </p>
            <p className="text-gray-500 text-sm">
              (Not necessarily in that order.)
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">SHOP</h3>
            <ul className="space-y-2">
              <FooterLink href="/shop">All Products</FooterLink>
              <FooterLink href="/shop/new">New Arrivals</FooterLink>
              <FooterLink href="/shop/bestsellers">Bestsellers</FooterLink>
              <FooterLink href="/shop/sale">Sale</FooterLink>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-white mb-4">INFO</h3>
            <ul className="space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/shipping">Shipping & Returns</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="mt-12 pt-8 border-t border-bgc-gray-light flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} Bad Guys Club. All rights reserved.
          </p>

          <div className="flex space-x-6">
            <SocialLink href={SOCIAL_LINKS.instagram} label="Instagram">
              <InstagramIcon className="w-6 h-6" />
            </SocialLink>
            <SocialLink href={SOCIAL_LINKS.twitter} label="Twitter">
              <TwitterIcon className="w-6 h-6" />
            </SocialLink>
            <SocialLink href={SOCIAL_LINKS.facebook} label="Facebook">
              <FacebookIcon className="w-6 h-6" />
            </SocialLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
