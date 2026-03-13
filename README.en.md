# Business Card Designer

[简体中文](./README.md)

## Overview

This is a Vite + React + TypeScript business card generator for editing and exporting landscape or portrait card layouts.

The app provides a live canvas preview, configurable content fields, theme switching, layer controls, and image export to `PNG` or `JPG`.

## Features

- Live editing for name, role, phone, email, address, social handle, and QR content
- Support for both landscape and portrait business card layouts
- Multiple built-in themes plus custom background, accent color, corner radius, and padding controls
- Canvas elements can be selected, dragged, resized, rotated, locked, hidden, deleted, and reordered
- QR code generation with live preview
- Export to `PNG` and `JPG`
- Automatic persistence in browser local storage

## Tech Stack

- React 19
- TypeScript
- Vite
- Konva / React Konva
- qrcode

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Vite will print the local URL in the terminal, for example: `http://127.0.0.1:5173/`.

### 3. Build for production

```bash
npm run build
```

The production output is generated in `dist/`.

### 4. Preview the production build locally

```bash
npm run preview
```

## Usage

1. Edit business card content from the control panel.
2. Switch between landscape and portrait layouts from the top toolbar.
3. Change themes or customize colors in the visual style section.
4. Fine-tune element position, size, visibility, locking, and layer order from the layer and element controls.
5. Export the final card as `PNG` or `JPG`.

## Project Structure

```text
src/
  App.tsx                  # App state, export flow, and page layout
  App.css                  # Global UI styles
  components/
    CardCanvas.tsx         # Live preview canvas and canvas interactions
    ControlPanel.tsx       # Left-side control panel
    Toolbar.tsx            # Top toolbar
  lib/
    document.ts            # Persistence, orientation transforms, layer operations
  hooks/
    useLoadedImage.ts      # Helper hook for image loading
  defaultDocument.ts       # Default template and initial element layout
  themes.ts                # Theme definitions and theme application logic
  types.ts                 # Shared type definitions
```

## Data Persistence

- The current document is stored in browser `localStorage`
- Storage key: `business-card-designer:v1`
- Orientation changes reflow the document using templates while preserving as much styling as possible

## Available Scripts

```bash
npm run dev      # Start the Vite dev server
npm run build    # Run TypeScript build and create a production bundle
npm run preview  # Preview the built app locally
```

## Current Limitations

- No automated test runner is configured yet
- Canvas and QR-related code is loaded on demand on first use to keep the initial bundle smaller
- Image uploads and embedded QR logos are not supported yet

## Manual Verification

Before shipping changes, verify at least the following flows:

- Text edits update the live preview immediately
- Landscape and portrait switching keeps the layout usable
- Theme switching and custom colors apply correctly
- QR code updates re-render correctly
- `PNG/JPG` export works as expected
