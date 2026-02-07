# Bad Guys Club 🔥

Modern e-commerce website for Bad Guys Club - the lifestyle brand for guys who love MMA, fast cars, gaming, tattoos, and their wives (not necessarily in that order).

Built with Next.js 15, TypeScript, Tailwind CSS, and Shopify integration.

## Features

- 🎨 Bold, dark-themed design with smooth animations
- 🛒 Full Shopify Storefront API integration
- 📱 Fully responsive (mobile-first)
- ⚡ Fast, optimized performance
- 🎯 SEO-friendly
- 🔐 Secure checkout via Shopify

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **E-commerce:** Shopify Storefront API
- **Image Optimization:** Next.js Image

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Shopify store with products
- Shopify Storefront API access token

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bleaderbae/Badguys.git
cd Badguys
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
```

**How to get your Shopify credentials:**

1. Go to your Shopify Admin
2. Navigate to Apps → Develop apps
3. Create a new app or select an existing one
4. Configure Storefront API scopes (read_products, read_product_listings, etc.)
5. Install the app and copy your Storefront Access Token

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
badguys/
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── cart/              # Cart page
│   ├── contact/           # Contact page
│   ├── product/[handle]/  # Dynamic product pages
│   ├── shop/              # Shop/catalog page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   └── Footer.tsx         # Site footer
├── lib/                   # Utilities and integrations
│   ├── shopify.ts         # Shopify API functions
│   └── types.ts           # TypeScript types
└── public/                # Static assets
```

## Shopify Setup

The site uses Shopify Storefront API for:
- Product listings
- Product details
- Cart management
- Checkout (redirects to Shopify)

Make sure your Shopify store has:
- Products created with images and descriptions
- Products published to the Online Store sales channel
- Storefront API access enabled

## Customization

### Brand Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  bgc: {
    black: '#0a0a0a',      // Background
    gray: '#1a1a1a',       // Secondary background
    'gray-light': '#2a2a2a', // Tertiary background
    red: '#dc2626',        // Primary accent
    'red-dark': '#991b1b', // Hover states
    white: '#f5f5f5',      // Text
  },
}
```

### Content

- Homepage hero: `app/page.tsx`
- About page story: `app/about/page.tsx`
- Navigation links: `components/Header.tsx`
- Footer links: `components/Footer.tsx`

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Any Node.js hosting

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Contributing

This is a private project for Bad Guys Club. If you have suggestions or find bugs, please open an issue.

## License

GNU General Public License v3.0 - see LICENSE file for details

---

**Bad Guys Club** - For the modern guy who does what he loves (and feels appropriately guilty about it).

Made with ❤️ (and a little bit of guilt) for the bad guys who aren't really that bad.