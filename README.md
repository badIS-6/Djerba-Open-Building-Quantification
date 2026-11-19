# Cloud-Based Djerba Open Building Quantification
# Djerba Building Footprint Quantification


## 1. Context

Building footprint quantification is an important component of urban and spatial planning. It provides information about the spatial distribution of buildings, settlement density, urban development patterns and land occupation.

This cloud-based project uses Google Earth Engine and open geospatial datasets to quantify building footprints across Djerba, Tunisia.

The main objectives are to:
- Estimate the total number of buildings.
- Analyse the distribution and density of buildings.
- Compare building distribution across Djerba's cities.
- Visualize population density.


## 2. Scope

### 2.1 Spatial Scope

The study covers **Djerba Island, Médenine Governorate, Tunisia**.
<img width="1017" height="717" alt="image" src="https://github.com/user-attachments/assets/3601eb27-50c1-48f2-9222-f77dfdc78f88" />

- Study area: 497.35 km².
- Population: 187,831.
- Population density: 365 people/km²



### 2.2 Temporal Scope

The building analysis covers 2016-2023.


## 3. Input Data

The project uses four datasets hosted directly in Google Earth Engine:

| Dataset                           | GEE Asset ID                                 | Main attributes                                      |
| --------------------------------- | -------------------------------------------- | ---------------------------------------------------- |
| Google Open Buildings V3          | `GOOGLE/Research/open-buildings/v3/polygons` | Building geometry, confidence, footprint area        |
| Google Open Buildings Temporal V1 | `GOOGLE/Research/open-buildings-temporal/v1` | Building presence, fractional building count, height |
| WorldPop R2025A                   | `WorldPop/GP/100m/R2025A/v1/pop`             | Estimated residential population                     |
| FAO GAUL 2025                     | `FAO/GAUL/2025/level2`                       | Administrative boundaries and subdivision names      |


## 4. Environment and Layers:

**GEE Project Link**: https://code.earthengine.google.com/e3abca74eb488df63f1cc4a2370203d5


### Map layers:

## Administrative Boundaries
The three administrative subdivisions of Djerba:
- Houmt Souk
- Midoun
- Ajim
<img width="969" height="687" alt="image" src="https://github.com/user-attachments/assets/97346c94-2156-4c6e-a2ba-72b4a2d339bb" />

## Building Footprints
Individual buildings detected by Open Buildings V3, filtered at confidence ≥ 0.75.
<img width="969" height="687" alt="image" src="https://github.com/user-attachments/assets/9c0bf4f5-cf68-4e9e-b610-464f67b3d0e4" />

## Building Presence
Raster representation of building presence confidence for 2023.
<img width="969" height="687" alt="image" src="https://github.com/user-attachments/assets/7c0b99ec-d013-4fb3-8ff6-db7b03fe91bc" />

## Building Density
Number of detected buildings per km², aggregated on a 500m grid.
<img width="969" height="687" alt="image" src="https://github.com/user-attachments/assets/a1835920-1b59-4779-9d39-78d2f82eb05d" />

## Building Height
Estimated building heights in meters.
<img width="969" height="687" alt="image" src="https://github.com/user-attachments/assets/15884645-eeb4-400b-9775-3895b76a58e4" />

## Population Density
Estimated inhabitants per km² using WorldPop 2026
<img width="969" height="687" alt="image" src="https://github.com/user-attachments/assets/df74a9a5-c1c3-4518-8747-1a18e9920567" />



## 5. Data Analysis

### 5.1 Main Statistics:

| Indicator                     |        Result | Unit            |
| ----------------------------- | ------------: | --------------- |
| Study area                    |        497.35 | km²             |
| Total detected buildings      |       153,083 | Buildings       |
| Total building footprint area | 16.52         | km²             |
| Mean building footprint area  |        107.88 | m²/building     |
| Average building density      |        307.79 | Buildings/km²   |
| Building footprint coverage   |          3.32 | % of study area |


**Figure 1 – Building Count Evolution (2016–2023)**
<img width="360" height="231" alt="image" src="https://github.com/user-attachments/assets/0b4b781b-48e8-41bc-b319-3b9ff432a213" />


**Figure 2 – Building Count by Administrative Unit**





## 6. Conclusions

The initial results identify approximately **153,083 building footprints** across the 497.35 km² study area, based on the May 2023 Open Buildings V3 dataset and a confidence threshold of 0.75.

The cumulative footprint area reaches approximately 16.52 km², with an average footprint size of 107.88 m² per detected building.

The average density is approximately 308 detected buildings per km². This is an island-wide average and does not represent the actual density of buildings within developed areas only.

The results provide several possibilities for spatial interpretation:

1. **Urban concentration:** Administrative building counts and the density layer can reveal differences in settlement concentration between Houmt Souk, Midoun and Ajim.

2. **Urban development:** The 2016–2023 temporal analysis provides an overview of changes in estimated building presence and supports the identification of areas experiencing development.

3. **Population and settlement relationships:** Comparing population density with building density can reveal differences between residential concentration and the distribution of built structures.

4. **Building characteristics:** Footprint area and estimated building height provide complementary information about the physical characteristics of the built environment.


