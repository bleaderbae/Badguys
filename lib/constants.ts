export const SOCIAL_LINKS = {
  instagram: "https://instagram.com",
  twitter: "https://twitter.com",
  facebook: "https://facebook.com",
};

export const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/shop", label: "SHOP" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
] as const;

export type StartMenuItem = {
  type: 'link';
  label: string;
  href: string;
  icon: string;
} | {
  type: 'separator';
};

export const START_MENU_ITEMS: StartMenuItem[] = [
  { type: 'link', href: "/profile", label: "My Account", icon: "👤" },
  { type: 'link', href: "/cart", label: "Cart", icon: "🛒" },
  { type: 'link', href: "/settings", label: "Settings", icon: "⚙️" },
  { type: 'separator' },
  { type: 'link', href: "/shop/golf", label: "Golf Drop", icon: "⛳" },
  { type: 'link', href: "/shop/samurai", label: "Samurai Drop", icon: "⚔️" },
  { type: 'link', href: "/shop/all", label: "Shop Network", icon: "🌐" },
  { type: 'link', href: "/product", label: "The Vault", icon: "⚰️" },
  { type: 'separator' },
  { type: 'link', href: "/about", label: "About System", icon: "💻" },
  { type: 'link', href: "/contact", label: "Contact Admin", icon: "📧" },
  { type: 'separator' },
];
