// src/ScatterPlot.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ScatterPlot = () => {
  const svgRef = useRef();

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
      .then(response => response.json())
      .then(data => {
        drawChart(data);
      });
  }, []);

  const drawChart = (data) => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 500;
    const padding = 60;

    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1])
      .range([padding, width - padding]);

    const yScale = d3.scaleTime()
      .domain([d3.min(data, d => new Date(d.Seconds * 1000)), d3.max(data, d => new Date(d.Seconds * 1000))])
      .range([padding, height - padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height - padding})`)
      .call(xAxis);

    svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${padding}, 0)`)
      .call(yAxis);

    const tooltip = d3.select('body').append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('padding', '10px');

    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => yScale(new Date(d.Seconds * 1000)))
      .attr('r', 5)
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => new Date(d.Seconds * 1000))
      .attr('fill', d => d.Doping ? 'blue' : 'orange')
      .on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`Year: ${d.Year}<br>Time: ${d.Time}<br>${d.Doping ? d.Doping : 'No doping allegations'}`)
          .attr('data-year', d.Year)
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
      });

    // Legend
    const legend = svg.append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${width - 200}, ${padding})`);

    legend.append('rect')
      .attr('x', -20)
      .attr('y', 0)
      .attr('width', 210)
      .attr('height', 60)
      .attr('fill', 'white')
      .attr('stroke', 'black');

    legend.append('circle')
      .attr('cx', 10)
      .attr('cy', 10)
      .attr('r', 5)
      .attr('fill', 'orange');

    legend.append('text')
      .attr('x', 20)
      .attr('y', 15)
      .text('No doping allegations')
      .style('font-size', '12px')
      .attr('alignment-baseline', 'middle');

    legend.append('circle')
      .attr('cx', 10)
      .attr('cy', 40)
      .attr('r', 5)
      .attr('fill', 'blue');

    legend.append('text')
      .attr('x', 20)
      .attr('y', 45)
      .text('Riders with doping allegations')
      .style('font-size', '12px')
      .attr('alignment-baseline', 'middle');
  };

  return (
    <div>
      <h1 id="title">Doping in Professional Bicycle Racing</h1>
      <svg ref={svgRef} width={800} height={500}></svg>
    </div>
  );
};

export default ScatterPlot;
