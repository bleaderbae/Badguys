import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/constants";
import { InstagramIcon, TwitterIcon, FacebookIcon } from "./Icons";

const currentYear = new Date().getFullYear();

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
              <li>
                <Link
                  href="/shop"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/new"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/bestsellers"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/sale"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-white mb-4">INFO</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="mt-12 pt-8 border-t border-bgc-gray-light flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} Bad Guys Club. All rights reserved.
          </p>

          <div className="flex space-x-6">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="sr-only">Twitter</span>
              <TwitterIcon className="w-6 h-6" />
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="sr-only">Facebook</span>
              <FacebookIcon className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
