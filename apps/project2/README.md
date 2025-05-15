# BR-CTI Frontend

This is the frontend for the BR-CTI (Blockchain-based B&R Cyber Threat Intelligence) platform, built with Next.js, Tailwind CSS, and TypeScript.

## Features

- Modern UI with responsive design
- MVP architecture (Store, Components, Context)
- Wallet management and registration
- Network configuration
- Local data management with STIX/CTI processing
- Machine learning model management
- Knowledge plane visualization with ECharts
- Blockchain explorer
- Responsive sidebar navigation

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
├── app/                  # Next.js App Router
│   ├── client/           # Client pages
│   │   ├── wallet/       # Wallet management
│   │   ├── wallet_register/ # Wallet registration
│   │   ├── network/      # Network configuration
│   │   ├── local-data/   # Local data management
│   │   └── ml-model/     # Machine learning model management
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ui/               # UI components
│   ├── wallet/           # Wallet-specific components
│   ├── data/             # Data-specific components
│   ├── model/            # Model-specific components
│   ├── charts/           # Chart components
│   ├── blockchain/       # Blockchain components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
│   ├── api.ts            # API client
│   └── utils.ts          # Helper functions
├── store/                # State management
│   ├── walletStore.ts    # Wallet state
│   ├── networkStore.ts   # Network state
│   ├── dataStore.ts      # Data state
│   └── modelStore.ts     # Model state
├── api/                  # API documentation
│   └── readme/           # API endpoints documentation
└── public/               # Static assets
```

## Migrated Pages

The following pages have been migrated from the original project:

1. **Wallet Management** (`/client/wallet`)
   - View wallet balance and transactions
   - Manage wallet settings

2. **Wallet Registration** (`/client/wallet_register`)
   - Create new wallet
   - Register wallet on blockchain

3. **Network Configuration** (`/client/network`)
   - Configure client and blockchain server connections
   - Test network connectivity

4. **Local Data Management** (`/client/local-data`)
   - View and manage CTI data
   - Process data through STIX/CTI conversion
   - Visualize data in knowledge plane and traffic views

5. **ML Model Management** (`/client/ml-model`)
   - View and manage machine learning models
   - Upload and train models
   - Register models on blockchain

## Architecture

This project follows the MVP (Model-View-Presenter) architecture:

- **Model**: Represented by the stores (using Zustand)
- **View**: React components that render the UI
- **Presenter**: Context and hooks that connect the model to the view

## Micro-Frontend Architecture

This project is part of a micro-frontend architecture using qiankun:

- **Main App**: The entry application that hosts all micro-frontends
- **Project2** (This app): Running on port 3001
- **Data-View**: A Vue.js application for data visualization

To run the entire system:

```bash
# From root directory
pnpm dev

# Or using the start script
node scripts/start-all.mjs
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.


