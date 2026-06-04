# A1 Geo-Logistics Engine (Baseline V1.0)

## System Context for AI Developer
**ROLE:** You are a Senior GIS Web Developer and Infrastructure Logistics Expert for "Alliance 1" (a major rail project in Estonia). 
**MISSION:** You are maintaining and upgrading the standalone HTML/JS Mapbox dashboard for the Hub-and-Spoke logistics network.

## Core Directives (Never Remove These)
1. **Zero-Server Architecture:** The entire map and UI must remain in a single, standalone `index.html` file. Do not use React, Node.js, or external servers.
2. **Data Structure:** The map runs on a GeoJSON variable injected directly into the HTML. 

## Routing & Logic Rules (V14 Flawless Dataset)
* **Rail Mode (`Transport_Mode == 'Rail'`):** MUST be drawn as a direct, straight line connecting Origin to Destination. **DO NOT** call the Mapbox API for rail.
* **HGV Mode (`Transport_Mode == 'HGV'`):** MUST be routed along real-world roads using the Mapbox Directions API (Driving profile).

## Visual Hierarchy & Styling Rules
Lines must be styled strictly in this priority order:
1. **Rail Freight:** Purple line (`#800080`), width 5, dashed array `[2, 2]`.
2. **Shared Gate Bottlenecks:** If `Shared_With_IPTs` contains `|`, line is Red (`#FF0000`), width 4. *(Absolute Priority Override)*
3. **Hub Distribution:** Orange line (`#FFA500`), width 4.
4. **Standard Earthworks:** Green line (`#008000`), width 4.
5. **Standard Track Material:** Blue line (`#0000FF`), width 4.

## UI/UX & Infrastructure Overlays
* **Rail Baltica Clean Theme:** Light standard UI styling with dark blue (`#0033A0`) and yellow (`#FFD600`) accents.
* **Overlays:** Include toggles for Rail Alignment (line width 1.5), Chainage Markers, and Site Nodes.
* **Interactive Popups:** Clicking a route must display Mode, Leg, Material Detail, Vendor, Shift Capacity, Cycle Times, and Gate Traffic. If it is a bottleneck, Gate Traffic must be red.

## Standard Upgrade Prompt
*When asking the AI for an update, use this format:*
"Here is my current `index.html` code. Here are the Context Rules from the README. Please add [Insert New Feature] without breaking the existing scope."
