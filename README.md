![logo1](https://github.com/user-attachments/assets/ed277c41-552a-4c96-8752-1f37cf087ae7)

<h1 align="center">AWS Marketplace Integration Platform - Frontend</h1>

## Overview

This is the frontend application for EasyMarketplace, a comprehensive AWS Marketplace integration platform that connects ISVs, Resellers, Distributors, and Buyers. Built with Next.js 15 and React 19, it provides a modern, responsive interface for all user types to interact with the AWS Marketplace ecosystem.

## Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [Radix UI](https://www.radix-ui.com/)
- **State Management**: [React Query](https://tanstack.com/query/latest)
- **Authentication**: Custom auth with AWS integration
- **Data Fetching**: Axios
- **Form Handling**: React Hook Form
- **Date Handling**: date-fns
- **Icons**: Lucide React, Tabler Icons
- **UI/UX**: Framer Motion for animations

## Features

### User Authentication & Management
- Multi-role login (ISV, Reseller, Distributor, Buyer)
- AWS account integration
- Role-based access control
- User profile management

### ISV Dashboard
- Listing management and performance tracking
- Reseller authorization workflow
- Disbursement monitoring
- Private offer creation and management

### Reseller Dashboard
- ISV discovery and connection
- Authorization request management
- Offer distribution
- Performance analytics

### Distributor Dashboard
- Network management for ISVs and resellers
- Deal activity monitoring
- Unified disbursement reporting

### Buyer Dashboard
- Offer review across storefronts
- Contract management
- Renewal tracking

## Project Structure

```
frontend/
├── app/                  # Next.js app directory
│   ├── (auth)/           # Authentication routes
│   ├── (dashboard)/      # Dashboard routes
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/           # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── dashboard/        # Dashboard components
│   └── shared/           # Shared components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── providers/            # React providers
├── public/               # Static assets
├── services/             # API services
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 20.x or later
- pnpm 8.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/easymarketplace.git
   cd easymarketplace/frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
pnpm build
pnpm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_APP_URL` | Frontend Domain URL | Yes |

## Development Guidelines

### Code Style

- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use TypeScript for type safety
- Use functional components with hooks
- Use named exports for components

### Component Structure

```tsx
// Example component structure
import { FC } from 'react';
import { Button } from '@/components/ui/button';

interface ExampleProps {
  title: string;
}

export const Example: FC<ExampleProps> = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
      <Button>Click me</Button>
    </div>
  );
};
```

### State Management

- Use React Query for server state
- Use React Context for global UI state
- Use React useState for local component state

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Submit a pull request

## License

This project is proprietary software. All rights reserved.
