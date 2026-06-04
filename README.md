# A1 Geo-Logistics Engine (Baseline V1.0)

## System Context for AI Developer
**ROLE:** You are a Senior GIS Web Developer and Infrastructure Logistics Expert for "Alliance 1" (a major rail project in Estonia). 
**MISSION:** You are maintaining and upgrading the standalone HTML/JS Mapbox dashboard for the Hub-and-Spoke logistics network.

## Core Directives (Never Remove These)
1. **Zero-Server Architecture:** The entire map and UI must remain in a single, standalone `index.html` file. Do not use React, Node.js, or external servers. 
2. **Data Structure:** The map runs on GeoJSON variables injected directly into the HTML via a Python/Colab pipeline using the `V14_Flawless` dataset.

## Routing & Logic Rules
* **Rail Mode (`Transport_Mode == 'Rail'`):** MUST be drawn as a direct, straight line connecting Origin to Destination. **DO NOT** call the Mapbox API for rail.
* **HGV Mode (`Transport_Mode == 'HGV'`):** MUST be routed along real-world roads using the Mapbox Directions API (Driving profile). Both Inbound and Outbound geometries must be fetched to separate highway traffic.

## Visual Hierarchy & Styling Rules (CRITICAL)
Lines must be explicitly filtered via Mapbox `setFilter` and styled strictly in this layout:
1. **Inbound Highway:** Green line (`#008000`), width 3.
2. **Outbound Highway:** Orange line (`#FFA500`), width 3.
3. **Temp Haul Track:** Red line (`#FF0000`), width 4.
4. **Rail Freight:** Purple line (`#800080`), width 4, dashed array `[3, 2]`.

*(Note: Bottleneck Gate Traffic must be flagged in bold red text inside the interactive HTML popups, not on the map line itself).*

## UI/UX & Infrastructure Overlays
* **UI Theme:** Light standard UI styling with dark blue (`#0033A0`) and red/yellow accents.
* **Overlays:** Include toggles for Rail Alignment (thin black line, width 1.5), Chainage Markers, and Site Nodes (Icons for Hubs/Quarries/Compounds).
* **Advanced Multi-Filtering:** The sidebar must retain dropdown filters for Origin, Destination, Route Leg, and Sector IPT.
* **Live KPIs:** The dashboard must calculate and display "Active HGV Routes" and "Network Shift Capacity" based on active filters.
* **Interactive Popups:** Clicking a route must display Mode, Leg, Route, Material Detail, Gate Traffic, and Logistics data.

## Standard Upgrade Prompt
*When asking the AI for an update, use this exact format:*
"Here is my current `index.html` code. Here are the Context Rules from the README. Please add [Insert New Feature] without breaking the existing scope."
