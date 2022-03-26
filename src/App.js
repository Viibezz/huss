import React, {useState} from "react";
import covidData from "./data/combinedData.json";
import DeckGL from '@deck.gl/react';
import {StaticMap} from 'react-map-gl';
import {HeatmapLayer} from '@deck.gl/aggregation-layers';
import {ScatterplotLayer} from '@deck.gl/layers';
import {HexagonLayer} from '@deck.gl/aggregation-layers';

export default function App() {
  const dat=[
    {COORDINATES: [-122.42177834, 37.78346622], WEIGHT: 10},
    {COORDINATES: [-125.42177834, 37.78346622], WEIGHT: 10}
  ] 

  const layers = [
    new HeatmapLayer({
      id: 'heatmapLayer',
      data: covidData,
      getPosition: d => [d.longitude, d.latitude],
      getWeight: d => 10,
      opacity: .6
    }),

    // new ScatterplotLayer({
    //   id: 'scatter',
    //   data: covidData,
    //   opacity: 0.8,
    //   filled: true,
    //   radiusMinPixels: 5,
    //   radiusMaxPixels: 10,
    //   getPosition: d => [d.longitude, d.latitude],
    //   getFillColor: d => d.n_killed > 0 ? [200, 0, 40, 150] : [255, 140, 0, 100],
    //   pickable: true,
    // }),

    new HexagonLayer({
      id: 'hexagon-layer',
      data:covidData,
      pickable: true,
      extruded: true,
      radius: 5000,
      colorDomain: [0,3],
      elevationScale: 500,
      getPosition: d => [d.longitude, d.latitude],
      getElevationWeight: d => (d.deaths * 2) + d.cases,
      onHover: ({object, x, y}) => {
        const el = document.getElementById('tooltip');
        if (object) {
          const county = object.points[0].county 
          const state = object.points[0].state 
          const deaths = object.points[0].deaths 
          const cases = object.points[0].cases           
          el.innerHTML = `<h1>${county}, ${state}</h1>
                          <h1>cases:${cases}, deaths:${deaths}</h1>`
          el.style.display = 'block';
          el.style.opacity = 0.9;
          el.style.left = x + 'px';
          el.style.top = y + 'px';
        } else {
          el.style.display = 'none';
        }
      }
    })
  ];

  const [viewport, setViewport] = useState({
    latitude: 40,
    longitude: -100,
    width: "100vw",
    height: "100vh",
    zoom: 3
  });

  return (
    <div>
      <DeckGL 
      initialViewState={viewport} 
      controller={true} 
      layers={layers}>
        <StaticMap
          reuseMaps
          mapStyle="mapbox://styles/bawsss/cke1ocyjo04n91bo760nyp4za"
          preventStyleDiffing={true}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        />
      </DeckGL>
    </div>
  );
}
