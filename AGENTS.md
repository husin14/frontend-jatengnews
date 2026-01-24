# AGENTS.md - Developer Guide for TVKU Frontend

This document provides guidelines for AI coding agents and developers working on the TVKU frontend codebase.

## Project Overview

- **Framework**: Next.js 15.4.4 with React 19
- **Language**: TypeScript 5
- **Build Tool**: Next.js (with Turbopack support)
- **Package Manager**: npm (package-lock.json present)
- **Linting**: ESLint with Next.js configuration
- **Styling**: Custom CSS (no Tailwind detected)

## Build/Lint/Test Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
```

### Production
```bash
npm run build        # Build for production
npm start            # Start production server
```

### Linting
```bash
npm run lint         # Run ESLint
```

### Testing
**Note**: No test framework currently configured. If adding tests:
- Consider using Jest + React Testing Library
- Add test scripts to package.json

### Docker (Local Deployment)
```bash
docker build -t frontend-tvku:1 .
docker run -d --env-file .env --name frontend-tvku-1 --restart unless-stopped -p 8123:8080 frontend-tvku:1
```

## Code Style Guidelines

### File Structure
```
src/
├── app/
│   ├── [lang]/              # i18n routes (id/en)
│   ├── components/          # React components
│   │   └── beranda/        # Homepage-specific components
│   ├── utils/              # Utility functions
│   ├── types.ts            # TypeScript type definitions
│   ├── dictionaries.ts     # i18n dictionaries
│   └── layout.tsx          # Root layout
├── middleware.ts           # Next.js middleware
```

### TypeScript Configuration
- **Target**: ES2017
- **Strict mode**: Enabled
- **Path alias**: `@/*` maps to `./src/*`
- **Module resolution**: bundler

### Import Guidelines

1. **Import Order** (observed pattern):
   ```typescript
   // 1. React/Next.js imports
   import React from "react";
   import Image from "next/image";
   import Link from "next/link";
   
   // 2. External libraries
   import axios from "axios";
   import { convert } from "html-to-text";
   
   // 3. Internal types/utils (using @ alias)
   import { berita, kategori } from "@/app/types";
   import { formatDate } from "@/app/utils/dateFormatter";
   
   // 4. Internal components
   import Sidebar from "@/app/components/sideBar";
   ```

2. **Use Path Aliases**: Always use `@/` instead of relative paths
   ```typescript
   // Good
   import { berita } from "@/app/types";
   
   // Avoid
   import { berita } from "../../types";
   ```

### Component Guidelines

1. **File Naming**:
   - Components: PascalCase (e.g., `BeritaTerbaruSection.tsx`)
   - Utilities: camelCase (e.g., `dateFormatter.ts`)
   - Types: lowercase (e.g., `types.ts`)

2. **Component Export**:
   ```typescript
   // Named export for complex components
   export const BeritaTerbaruSection: React.FC<Props> = ({ ... }) => { ... };
   
   // Default export for page/layout components
   export default function Header() { ... }
   ```

3. **Client Components**: Use `"use client"` directive when needed
   ```typescript
   "use client";
   
   import React, { useEffect, useState } from "react";
   ```

### Type Definitions

1. **Interfaces**: Use `interface` for object types (project convention)
   ```typescript
   export interface berita {
     id: number;
     judul: string;
     cover: string;
     // ...
   }
   ```

2. **Naming**: Use lowercase for domain models, PascalCase for component props
   ```typescript
   // Domain models
   export interface berita { ... }
   export interface kategori { ... }
   
   // Component props
   type BeritaTerbaruSectionProps = { ... };
   ```

3. **Optional Properties**: Use `?` for optional fields
   ```typescript
   filename?: string;
   link?: string;
   ```

### Naming Conventions

1. **Variables/Functions**: camelCase
   ```typescript
   const beritaTerbaru = [];
   const fetchData = async () => { ... };
   ```

2. **Components**: PascalCase
   ```typescript
   const Header = () => { ... };
   export const BeritaTerbaruSection: React.FC = () => { ... };
   ```

3. **Constants**: camelCase (or UPPER_CASE for true constants)
   ```typescript
   const baseurl = process.env.NEXT_PUBLIC_BASE_URL;
   const defaultLang = 'id';
   ```

4. **Types/Interfaces**: PascalCase for component props, lowercase for domain models

### Error Handling

1. **Try-Catch Pattern**:
   ```typescript
   try {
     const response = await axios.get(url);
     setData(response.data);
     setError(null);
   } catch (err) {
     console.error("Failed to fetch data:", err);
     setError("Gagal memuat data. Silakan coba lagi nanti.");
   } finally {
     setLoading(false);
   }
   ```

2. **State Management**: Use separate state for loading/error
   ```typescript
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   ```

3. **Conditional Rendering**: Handle loading/error states
   ```typescript
   if (loading) return <div>Loading...</div>;
   if (error) return <div>{error}</div>;
   ```

### Formatting

1. **Indentation**: 2 spaces (configured in TypeScript)
2. **Line Endings**: CRLF (Windows-style, as seen in files)
3. **JSX**: Use double quotes for attributes
4. **Semicolons**: Required (observed pattern)

### ESLint Rules
- Extends: `next/core-web-vitals`, `next/typescript`
- Disable specific rules with inline comments when needed:
  ```typescript
  const [dictionary, setDictionary] = useState<any>(null); //eslint-disable-line
  ```

## i18n (Internationalization)

- **Supported Languages**: `id` (Indonesian), `en` (English)
- **Default Language**: `id`
- **Route Pattern**: `/[lang]/...`
- **Dictionary Files**: `/dictionaries/{lang}.json`
- **Language Type**: Use `"id" | "en"` type annotation

## API Integration

- **Base URL**: `process.env.NEXT_PUBLIC_BASE_URL`
- **HTTP Client**: axios
- **API Pattern**: 
  ```typescript
  const response = await axios.get(`${baseurl}/endpoint`);
  const data = response.data.data; // Note: double .data
  ```

## Image Handling

- **Component**: Use Next.js `Image` component
- **Remote Patterns**: Configured for:
  - `https://apidev.tvku.tv/**`
  - `https://storage.tvku.tv/**`
  - `https://tvku.tv/**`

## Date Formatting

Use utility functions from `@/app/utils/dateFormatter`:
```typescript
import { formatDate, formatDateTime, getRelativeTime } from "@/app/utils/dateFormatter";

// Usage
formatDate(dateString, lang);         // "23 Januari 2026"
formatDateTime(dateString, lang);     // "23 Januari 2026, 16:36"
getRelativeTime(dateString, lang);    // "2 jam yang lalu"
```

## Common Patterns

### Data Fetching in Client Components
```typescript
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      setData(response.data.data);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [dependency]);
```

### HTML to Text Conversion
```typescript
import { convert } from "html-to-text";

const processedData = data.map((item) => ({
  ...item,
  deskripsi: convert(item.deskripsi, {
    selectors: [{ selector: "img", format: "skip" }],
  }),
}));
```

## Important Notes

1. **No test suite**: Tests are not currently configured
2. **Environment variables**: Store in `.env` file (see `.env.example`)
3. **Middleware**: Handles language redirects for `/berita` routes
4. **Image optimization**: Configured for remote image domains
5. **Line clamping**: Use CSS classes like `line-clamp-2` for truncation
