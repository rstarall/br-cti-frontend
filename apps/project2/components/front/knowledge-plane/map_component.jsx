'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Map Component - Simplified version
 */
export default function MapComponent({ id, type = 'world', data = [], options = {} }) {
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  // Initialize and update chart
  useEffect(() => {
    // Skip server-side rendering
    if (typeof window === 'undefined') return;

    const initChart = async () => {
      // Load ECharts if not already loaded
      if (!window.echarts) {
        console.log('Loading ECharts...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
        script.async = true;
        await new Promise(resolve => {
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      // Load world map data
      try {
        console.log('Loading world map data...');
        const response = await fetch('/map/json/world.json');
        const worldGeoJSON = await response.json();
        window.echarts.registerMap('world', worldGeoJSON);
      } catch (error) {
        console.error('Failed to load map data:', error);
        return;
      }

      // Initialize chart
      if (!chartRef.current && containerRef.current) {
        console.log('Initializing chart...');
        chartRef.current = window.echarts.init(containerRef.current);
      }

      // Update chart with data
      if (chartRef.current) {
        updateChart();
      }
    };

    const updateChart = () => {
      if (!chartRef.current) return;

      // Use provided data or default data
      const chartData = data && data.length > 0 ? data : [
        { name: 'China', value: 1200 },
        { name: 'United States', value: 800 },
        { name: 'Russia', value: 600 },
        { name: 'Germany', value: 400 },
        { name: 'Brazil', value: 300 }
      ];

      console.log('Map data:', chartData);

      // Create chart options
      const chartOptions = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}'
        },
        visualMap: {
          min: 0,
          max: Math.max(...chartData.map(item => Number(item.value || 0))),
          left: 'left',
          top: 'bottom',
          text: ['High', 'Low'],
          calculable: true,
          inRange: {
            color: ['#f2f2f2', '#4e79a7', '#1f77b4', '#0d4a6b']
          }
        },
        series: [
          {
            name: 'Threat Intelligence',
            type: 'map',
            map: type,
            roam: true,
            emphasis: {
              label: {
                show: true
              }
            },
            data: chartData,
            nameMap: {
              'China': '中国',
              'United States': '美国',
              'Russia': '俄罗斯',
              'Germany': '德国',
              'Brazil': '巴西',
              'Australia': '澳大利亚',
              'India': '印度',
              'United Kingdom': '英国',
              'Canada': '加拿大',
              'Japan': '日本',
              'France': '法国',
              'Italy': '意大利',
              'Spain': '西班牙',
              'Mexico': '墨西哥',
              'South Korea': '韩国'
            }
          }
        ]
      };

      // Merge with custom options
      const mergedOptions = { ...chartOptions, ...options };
      
      // Make sure we use our data if custom options include series
      if (options.series && options.series.length > 0) {
        mergedOptions.series = options.series.map(series => {
          if (series.type === 'map') {
            return { ...series, data: chartData };
          }
          return series;
        });
      }

      // Set chart options
      chartRef.current.setOption(mergedOptions);
    };

    // Initialize chart
    initChart();

    // Add resize handler
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, [data, type, options, id]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
