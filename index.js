import { 
  select, 
  geoPath, 
  geoEquirectangular, 
  zoom, 
  event,
	scaleOrdinal,
  schemeReds
} from 'd3';
import { loadAndProcessData } from './loadAndProcessData';
import { colorLegend } from './colorLegend';

const svg = select('svg');

// svg.append('g')
// 		.attr('transform', 'translate(600, 100)')
// 		.call(sizeLegend, {
//   		sizeScale,
//   		spacing: 80,
//   		textOffset: 10,
//   		nimTicks: 5,
//   		circleFill: 'rgba(0,0,0,0.5)'
// });

const projection = geoEquirectangular();
const pathGenerator = geoPath().projection(projection);

const g = svg.append('g');

const colorLegendg = svg.append('g')
		.attr('transform', 'translate(10, 300)')

g.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'})); 

svg.call(zoom().on('zoom', () => {
  g.attr('transform', event.transform);
}));

const colorScale = scaleOrdinal();

const colorValue = d => d.properties.Categorisation;


loadAndProcessData().then(countries => {
  
  colorScale.domain(countries.features.map(colorValue))
  						.domain(colorScale.domain().sort().reverse())
  						.range(schemeReds[colorScale.domain().length])
  
  console.log(colorScale.domain());
  colorLegendg.call(colorLegend, {
  		colorScale,
  		circleRadius: 6.5,
  		spacing: 18,
  		textOffset: 10,
    	backgroundRectWidth: 275,
});
  
  g.selectAll('path').data(countries.features)
  .enter().append('path')
    .attr('class', 'country')
    .attr('title', 'Hello')
    .attr('d', pathGenerator)
    .attr('fill', d => colorScale(colorValue(d)))
  .append('title')
    .text(d => d.properties.Country + ': ' + d.properties.Categorisation);
});

