# BR-CTI Frontend

This is the frontend of BR-CTI (Blockchain-based B&R Cyber Threat Intelligence) platform using React, built as a micro-frontend architecture with qiankun.

## Project Structure

This project consists of multiple micro-frontend applications:

- **enter** (port 3000): Main application that hosts all micro-frontends
- **project2** (port 3001): Next.js application for the main BR-CTI interface
- **data-view** (port 8081): Vue.js application for data visualization

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended)

### Installation

Install dependencies for all applications:

```bash
pnpm install
```

### Running the Project

You can run all micro-frontend applications simultaneously:

```bash
pnpm dev
```

Or use the start script:

```bash
node scripts/start-all.mjs
```

### Individual Application Startup

You can also start each application individually:

```bash
# Start enter application
cd apps/enter
pnpm dev

# Start project2 application
cd apps/project2
pnpm dev

# Start data-view application
cd apps/data-view
npm run serve
```

## Features

- Modern UI with responsive design
- MVP architecture (Store, Components, Context)
- Wallet management and registration
- Network configuration
- Local data management with STIX/CTI processing
- Machine learning model management
- Knowledge plane visualization with ECharts
- Blockchain explorer

## License

This project is licensed under the MIT License - see the LICENSE file for details.
