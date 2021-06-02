
import {Map, View} from 'ol';
import {Vector as VectorLayer} from 'ol/layer';
import VectorSource from 'ol/source/vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Icon, Style} from 'ol/style';



const randomPoint = ()=>{
    let x = Math.random() *360;
    let y = Math.random() *360;

    
    let iconFeature = new Feature({
        geometry: new Point([x, y]),
        name: 'Null Island',
        population: 4000,
        rainfall: 500,
      });

      var iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: '/images/Cloud_CUCM_blue.png',
        }),
      });
      iconFeature.setStyle(iconStyle);
      
      return iconFeature;
}

let feature = randomPoint();
const map = new Map({
  target: 'map',
  layers: [
    new VectorLayer({
      source:new VectorSource({
          features:[feature]
      })
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 3
  })
});

