# Headlessz

**Headlessz** is the foundational starting point for every new website from Zimmer Marketing. It's our battle-tested template that brings together our best tools, experience, and proven patterns to create fast, responsive, and scalable websites efficiently.

## 🚀 What is Headlessz?

Headlessz lies at the foundation of every new website from Zimmer Marketing. It's our starting point that brings together our best tools and experience. It's built on **SvelteKit**, a modern framework that enables us to create fast, responsive websites and web apps efficiently, ensuring outstanding performance and search engine visibility.

Additionally, Headlessz utilizes the **SPOCK stack**, comprising **Svelte** for the front end and **PocketBase** for the back end. PocketBase offers a lightweight, real-time backend for managing content, users, and files, enabling easy construction of dynamic, interactive sites that can scale as needed.

We also include **Shadcn-Svelte components**, which are fully customizable building blocks that help us quickly match any design our graphic designers create in Figma while keeping the code easy to maintain and accessible across all devices. **Tailwind CSS** is another key component, allowing us to create styled sites rapidly with consistent, responsive designs that work universally.

By combining these technologies with our custom code, Headlessz ensures that every new website starts with a solid, proven foundation—saving us time, maintaining consistency across our projects, and enabling us to focus on delivering unique, high-quality results.

## 🏗️ Architecture

### Tech Stack (SPOCK)

- **S**velteKit - Modern web framework
- **P**ocketBase - Lightweight backend with real-time capabilities
- **O**pen source components - Shadcn-Svelte UI library
- **C**SS framework - Tailwind CSS for rapid styling
- **K**it - SvelteKit for routing and SSR

### Key Features

- **⚡ Performance**: Built on SvelteKit for blazing-fast performance
- **🎨 Design System**: Shadcn-Svelte components for consistent UI
- **📱 Responsive**: Mobile-first design with Tailwind CSS
- **🔍 SEO Optimized**: Built-in meta tags and sitemap generation
- **📊 Analytics**: Fathom Analytics integration
- **📝 Content Management**: PocketBase admin interface
- **🔄 Real-time**: Live updates with PocketBase subscriptions
- **🎯 Accessibility**: WCAG compliant components
- **🌙 Dark Mode**: Built-in dark/light theme support

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PocketBase instance

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd headlessz-pocketbase
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PUBLIC_POCKETBASE_URL=your_pocketbase_url
   PUBLIC_FATHOM_ID=your_fathom_id
   PUBLIC_FATHOM_URL=https://your-fathom-instance.com
   PUBLIC_ZIMBOT_PB=your_zimmer_bot_url
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

## 📁 Project Structure

```
headlessz-pocketbase/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/           # Shadcn-Svelte components
│   │   │   ├── navigation/   # Navigation components
│   │   │   ├── pocketbase/   # PocketBase integration
│   │   │   └── globals/      # Global components
│   │   ├── helpers/          # Utility functions
│   │   └── schemas/          # Zod validation schemas
│   ├── routes/
│   │   ├── api/              # API endpoints
│   │   ├── posts/            # Blog functionality
│   │   └── [...route]/       # Dynamic routing
│   └── app.css              # Global styles
├── static/                   # Static assets
├── components.json          # Shadcn configuration
├── tailwind.config.js      # Tailwind configuration
└── svelte.config.js        # SvelteKit configuration
```

## 🎯 Key Components

### Content Management
- **PocketBase Integration**: Full CRUD operations with real-time updates
- **Dynamic Routing**: Automatic page generation from PocketBase collections
- **Image Handling**: Optimized image loading with PbImage component
- **SEO Management**: Automatic meta tag generation with RouteMeta component

### UI Components
- **Shadcn-Svelte**: Pre-built, accessible components
- **Responsive Navigation**: Mobile-first navigation with hamburger menu
- **Form Handling**: Contact forms with validation and submission
- **Pagination**: Built-in pagination for content lists
- **Search**: Full-text search with topic filtering

### Developer Experience
- **Edit Buttons**: Quick access to PocketBase admin (dev mode)
- **Hot Reload**: Instant feedback during development
- **TypeScript**: Full type safety throughout the application
- **ESLint & Prettier**: Consistent code formatting

## 🚀 Deployment

### Vercel (Recommended)
```bash
pnpm build
```

The project is configured with `@sveltejs/adapter-vercel` for seamless deployment on Vercel.

### Environment Variables
Make sure to set the following environment variables in your deployment platform:

- `PUBLIC_POCKETBASE_URL`
- `PUBLIC_FATHOM_ID`
- `PUBLIC_FATHOM_URL`
- `PUBLIC_ZIMBOT_PB`

## 📊 Analytics & Tracking

### Fathom Analytics
- Privacy-focused analytics
- Automatic page view tracking
- Custom event tracking for form submissions
- Development mode detection

### SEO Features
- Automatic sitemap generation
- Meta tag optimization
- Open Graph support
- Twitter Card support
- Canonical URLs

## 🎨 Customization

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Theme**: Extensible color system
- **Dark Mode**: Built-in dark/light theme toggle
- **Responsive Design**: Mobile-first approach

### Components
- **Shadcn-Svelte**: Easily customizable components
- **Component Library**: Reusable UI components
- **Form Components**: Pre-built form elements
- **Navigation**: Flexible navigation system

## 🔧 Development

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm check        # Type checking
pnpm lint         # Lint code
pnpm format       # Format code
```

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Svelte Check**: Svelte-specific type checking

## 📝 Content Management

### PocketBase Collections
- **pages**: Static pages with dynamic content
- **posts**: Blog posts with topics and authors
- **globals**: Site-wide settings and configuration
- **topics**: Blog post categorization
- **users**: User management

### Admin Interface
- Access via `your-pocketbase-url/_/`
- Real-time content updates
- File management
- User authentication
- API documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is proprietary to Zimmer Marketing. All rights reserved.

## 🆘 Support

For support and questions, contact the Zimmer Marketing development team.

---

**Built with ❤️ by Zimmer Marketing**
