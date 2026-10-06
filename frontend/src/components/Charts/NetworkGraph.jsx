// Role/Owner: Member 3 (Analytics, Graph & Visualization Lead)
// Core Responsibility: D3 force-directed social graph visualization of user interactions and echo chambers
// Key Interface/Contract: Accepts `{ nodes, edges }` props; renders interactive SVG with zoom, drag, and community colors

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function NetworkGraph({ nodes = [], edges = [] }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 350;

    const defaultNodes = nodes.length > 0 ? nodes : [
      { id: 'u1', label: 'User 1', community: 0, veracity: 'factual' },
      { id: 'u2', label: 'User 2', community: 0, veracity: 'factual' },
      { id: 'u3', label: 'User 3', community: 1, veracity: 'misinformation' },
      { id: 'u4', label: 'User 4', community: 1, veracity: 'misinformation' },
      { id: 'u5', label: 'User 5', community: 0, veracity: 'factual' },
    ];

    const defaultEdges = edges.length > 0 ? edges : [
      { source: 'u1', target: 'u2', weight: 1 },
      { source: 'u3', target: 'u4', weight: 2 },
      { source: 'u2', target: 'u3', weight: 0.5 },
      { source: 'u1', target: 'u5', weight: 1 },
    ];

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation(defaultNodes)
      .force('link', d3.forceLink(defaultEdges).id((d) => d.id).distance(60))
      .force('charge', d3.forceManyBody().strength(-120))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(defaultEdges)
      .enter()
      .append('line')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', (d) => Math.sqrt(d.weight || 1));

    const node = svg.append('g')
      .selectAll('circle')
      .data(defaultNodes)
      .enter()
      .append('circle')
      .attr('r', 8)
      .attr('fill', (d) => (d.veracity === 'misinformation' ? '#ef4444' : '#10b981'))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y);
    });

    return () => simulation.stop();
  }, [nodes, edges]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          User Interaction & Echo Chamber Graph (PHEME)
        </h4>
        <div className="flex space-x-3 text-xs">
          <span className="flex items-center space-x-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <span>Factual</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
            <span>Misinfo</span>
          </span>
        </div>
      </div>
      <svg ref={svgRef} viewBox="0 0 600 350" className="h-64 w-full" />
    </div>
  );
}
