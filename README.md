# RBE_A1_Logistics

A comprehensive React dashboard for visualizing and forecasting logistics operations across multiple work teams, material types, and gate locations.

---

## Project Overview

**RBE_A1_Logistics** is a browser-based logistics mapping and forecasting application designed to help teams plan and visualize material movement over a 5-year horizon. The dashboard combines a flexible data-entry forecasting matrix with rich, interactive visualizations — giving planners a clear picture of upcoming work across IPT Teams, Work Sections, Work Types, Material Types, Quarries, and Gates.

The app is built with **React** and styled with **Tailwind CSS** for a clean, professional interface.

---

## Key Features

- 📊 **5-Year Forecasting Matrix** — Enter and edit forecast data across all metadata fields with fully available dropdowns (no cascading restrictions).
- 🏷️ **Rich Metadata Support** — Track forecasts by IPT Teams, Work Sections, Work Types, Material Types, Quarries, and Gates.
- 📈 **Visualization Dashboard** — Interactive charts breaking down forecast data by year, material type, and gate location.
- ✏️ **Inline Editing** — Update existing forecasts directly within the matrix.
- 🎨 **Professional UI** — Responsive, modern styling powered by Tailwind CSS.
- 🔄 **Service Layer** — Clean separation of data logic via a dedicated forecast service.

---

## Data and Map Layers

The application works with generic logistics data layers, including:

- **Forecast Records** — Time-series entries spanning a 5-year window.
- **Metadata Dimensions** — IPT Teams, Work Sections, Work Types, Material Types, Quarries, and Gate locations.
- **Aggregated Views** — Data grouped by year, material type, and gate for visualization.

> Map and data layers are intentionally generic and can be adapted to your organization's specific datasets and sources.

---

## How to Run

This is a browser-based app. To get started locally:

```bash
# 1. Clone the repository
git clone https://github.com/your-org/RBE_A1_Logistics.git
cd RBE_A1_Logistics

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open the app