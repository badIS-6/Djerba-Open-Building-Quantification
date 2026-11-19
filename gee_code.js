
var gaul = ee.FeatureCollection('FAO/GAUL/2025/level2');

var admin = gaul
  .filter(ee.Filter.eq('GAUL0_NAME', 'Tunisia'))
  .filter(ee.Filter.inList('GAUL2_NAME', [
    'Djerba Houmet Souk',
    'Djerba Midoun',
    'Djerba Ajim'
  ]));

var aoi = admin.geometry();

print('Djerba administrative units found:', admin.aggregate_array('GAUL2_NAME'));
print('Study area (km2):', aoi.area(1).divide(1e6));

Map.centerObject(aoi, 11);
Map.setOptions('SATELLITE');

var openBuildings = ee.FeatureCollection(
  'GOOGLE/Research/open-buildings/v3/polygons'
).filterBounds(aoi);

var buildings = openBuildings.filter(
  ee.Filter.gte('confidence', 0.75)
);

var buildingPoints = buildings.map(function(f) {
  return ee.Feature(f.geometry().centroid(1))
    .copyProperties(f, ['area_in_meters', 'confidence'])
    .set('one', 1);
});

var buildingCount = buildings.size();
var totalFootprint = ee.Number(
  buildings.aggregate_sum('area_in_meters')
);

print('Latest individual building count (May 2023, confidence >= 0.75):',
  buildingCount);
print('Total building footprint (m2):', totalFootprint);
print('Mean building footprint (m2):',
  totalFootprint.divide(buildingCount.max(1)));

var thresholdStats = ee.FeatureCollection([
  ee.Feature(null, {
    threshold: '0.65',
    count: openBuildings.filter(ee.Filter.gte('confidence', 0.65)).size()
  }),
  ee.Feature(null, {
    threshold: '0.70',
    count: openBuildings.filter(ee.Filter.gte('confidence', 0.70)).size()
  }),
  ee.Feature(null, {
    threshold: '0.75',
    count: buildings.size()
  }),
  ee.Feature(null, {
    threshold: '0.80',
    count: openBuildings.filter(ee.Filter.gte('confidence', 0.80)).size()
  }),
  ee.Feature(null, {
    threshold: '0.85',
    count: openBuildings.filter(ee.Filter.gte('confidence', 0.85)).size()
  })
]);

var temporal = ee.ImageCollection(
  'GOOGLE/Research/open-buildings-temporal/v1'
).filterBounds(aoi);

var annualBuildings = ee.FeatureCollection(
  ee.List.sequence(2016, 2023).map(function(y) {
    y = ee.Number(y);

    var image = temporal
      .filter(ee.Filter.calendarRange(y, y, 'year'))
      .mosaic()
      .select('building_fractional_count');

    var count = image.reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: aoi,
      scale: 4,
      maxPixels: 1e13,
      tileScale: 4
    }).get('building_fractional_count');

    return ee.Feature(null, {
      year: y,
      estimated_buildings: count
    });
  })
);

print('Annual estimated building counts (2016–2023):', annualBuildings);

var temporal2023 = temporal
  .filterDate('2023-01-01', '2024-01-01')
  .mosaic()
  .clip(aoi);

Map.addLayer(
  buildings.style({
    color: 'FF3020',
    fillColor: 'FF302055',
    width: 1
  }),
  {},
  'Open Buildings V3 footprints >= 0.75'
);

Map.addLayer(
  temporal2023.select('building_presence'),
  {
    min: 0,
    max: 1,
    palette: ['FFFFFF', 'FFD54F', 'E53935']
  },
  'Building presence confidence 2023',
  false
);

Map.addLayer(
  temporal2023.select('building_height'),
  {
    min: 0,
    max: 25,
    palette: ['FFFFFF', 'FDD835', 'FB8C00', 'B71C1C']
  },
  'Estimated building height 2023',
  false
);

var buildingImage = buildingPoints.reduceToImage({
  properties: ['one'],
  reducer: ee.Reducer.sum()
}).reproject({
  crs: 'EPSG:32632',
  scale: 10
});

var buildingCountGrid = buildingImage.reduceResolution({
  reducer: ee.Reducer.sum(),
  maxPixels: 4096
}).reproject({
  crs: 'EPSG:32632',
  scale: 500
});

var buildingDensity = buildingCountGrid
  .divide(ee.Image.pixelArea().divide(1e6))
  .rename('buildings_per_km2')
  .clip(aoi);

Map.addLayer(
  buildingDensity,
  {
    min: 0,
    max: 2000,
    palette: ['FFFFFF', 'FFF176', 'FB8C00', 'C62828']
  },
  'Building density (500m grid)',
  false
);

var worldPop = ee.ImageCollection(
  'WorldPop/GP/100m/R2025A/v1/pop'
).filter(ee.Filter.eq('country', 'TUN'));

var pop2026 = worldPop
  .filter(ee.Filter.eq('year', 2026))
  .mosaic()
  .select('population')
  .clip(aoi);

var populationDensity = pop2026
  .divide(ee.Image.pixelArea().divide(1e6))
  .rename('people_per_km2');

Map.addLayer(
  populationDensity,
  {
    min: 0,
    max: 5000,
    palette: ['FFFFFF', 'FFF59D', 'FF9800', 'D32F2F', '4A148C']
  },
  'Population density (WorldPop 2026)'
);

var annualPopulation = ee.FeatureCollection(
  ee.List.sequence(2015, 2030).map(function(y) {
    y = ee.Number(y);

    var image = worldPop
      .filter(ee.Filter.eq('year', y))
      .mosaic()
      .select('population');

    var total = image.reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: aoi,
      scale: 100,
      maxPixels: 1e13,
      tileScale: 4
    }).get('population');

    return ee.Feature(null, {
      year: y,
      population: total
    });
  })
);

print('WorldPop population estimates (2015–2030):', annualPopulation);

var adminStats = admin.map(function(unit) {
  var geom = unit.geometry();

  var localBuildings = buildingPoints.filterBounds(geom);
  var count = localBuildings.size();

  var areaKm2 = geom.area(1).divide(1e6);

  var population = ee.Number(pop2026.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: geom,
    scale: 100,
    maxPixels: 1e13,
    tileScale: 4
  }).get('population'));

  return unit.set({
    building_count: count,
    area_km2: areaKm2,
    building_density: ee.Number(count).divide(areaKm2),
    population_2026: population,
    population_density: population.divide(areaKm2),
    footprint_area_m2: localBuildings.aggregate_sum('area_in_meters')
  });
});

print('Administrative statistics:', adminStats);

Map.addLayer(
  admin.style({
    color: '00FFFF',
    fillColor: '00000000',
    width: 2
  }),
  {},
  'Djerba administrative boundaries'
);

// 1. Building count evolution
print(
  ui.Chart.feature.byFeature(
    annualBuildings,
    'year',
    ['estimated_buildings']
  )
  .setChartType('LineChart')
  .setOptions({
    title: 'Building Count Evolution (2016–2023)',
    hAxis: {title: 'Year', format: '####'},
    vAxis: {title: 'Estimated buildings'},
    lineWidth: 2,
    pointSize: 5,
    legend: {position: 'none'}
  })
);

// 2. Building count by administrative unit
print(
  ui.Chart.feature.byFeature(
    adminStats,
    'GAUL2_NAME',
    ['building_count']
  )
  .setChartType('ColumnChart')
  .setOptions({
    title: 'Building Count by Administrative Unit',
    hAxis: {title: 'Administrative unit'},
    vAxis: {title: 'Number of buildings'},
    legend: {position: 'none'}
  })
);
