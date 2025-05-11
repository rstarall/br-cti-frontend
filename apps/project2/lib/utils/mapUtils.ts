/**
 * 地图工具函数
 */

import { useEffect, useRef } from 'react';

// 声明全局变量，用于访问 echarts
declare global {
  interface Window {
    echarts: any;
  }
}

// 跟踪脚本加载状态
const scriptLoadStatus = {
  echarts: false,
  worldMap: false,
  chinaMap: false,
  initMap: false
};

/**
 * 加载地图脚本
 * @param callback 加载完成后的回调函数
 */
export const loadMapScripts = (callback: () => void) => {
  // 检查是否已加载 echarts
  if (window.echarts) {
    scriptLoadStatus.echarts = true;
    loadMapData(callback);
    return;
  }

  // 检查是否已经在加载 echarts
  const existingScript = document.querySelector('script[src*="echarts"]');
  if (existingScript) {
    existingScript.addEventListener('load', () => {
      scriptLoadStatus.echarts = true;
      loadMapData(callback);
    });
    return;
  }

  // 加载 echarts 脚本
  const echartsScript = document.createElement('script');
  echartsScript.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
  echartsScript.async = true;
  echartsScript.onload = () => {
    scriptLoadStatus.echarts = true;
    loadMapData(callback);
  };
  document.head.appendChild(echartsScript);
};

/**
 * 加载地图数据
 * @param callback 加载完成后的回调函数
 */
const loadMapData = (callback: () => void) => {
  // 检查是否所有地图数据都已加载
  if (scriptLoadStatus.worldMap && scriptLoadStatus.chinaMap && scriptLoadStatus.initMap) {
    callback();
    return;
  }

  // 加载世界地图数据
  if (!scriptLoadStatus.worldMap) {
    const existingWorldScript = document.querySelector('script[src*="world.js"]');
    if (!existingWorldScript) {
      const worldMapScript = document.createElement('script');
      worldMapScript.src = '/map/world.js';
      worldMapScript.async = true;
      worldMapScript.onload = () => {
        scriptLoadStatus.worldMap = true;
        checkAllScriptsLoaded(callback);
      };
      document.head.appendChild(worldMapScript);
    } else {
      existingWorldScript.addEventListener('load', () => {
        scriptLoadStatus.worldMap = true;
        checkAllScriptsLoaded(callback);
      });
    }
  }

  // 加载中国地图数据
  if (!scriptLoadStatus.chinaMap) {
    const existingChinaScript = document.querySelector('script[src*="china.js"]');
    if (!existingChinaScript) {
      const chinaMapScript = document.createElement('script');
      chinaMapScript.src = '/map/china.js';
      chinaMapScript.async = true;
      chinaMapScript.onload = () => {
        scriptLoadStatus.chinaMap = true;
        checkAllScriptsLoaded(callback);
      };
      document.head.appendChild(chinaMapScript);
    } else {
      existingChinaScript.addEventListener('load', () => {
        scriptLoadStatus.chinaMap = true;
        checkAllScriptsLoaded(callback);
      });
    }
  }

  // 加载地图初始化脚本
  if (!scriptLoadStatus.initMap) {
    const existingInitScript = document.querySelector('script[src*="init_map.js"]');
    if (!existingInitScript) {
      const initMapScript = document.createElement('script');
      initMapScript.src = '/map/init_map.js';
      initMapScript.async = true;
      initMapScript.onload = () => {
        scriptLoadStatus.initMap = true;
        checkAllScriptsLoaded(callback);
      };
      document.head.appendChild(initMapScript);
    } else {
      existingInitScript.addEventListener('load', () => {
        scriptLoadStatus.initMap = true;
        checkAllScriptsLoaded(callback);
      });
    }
  }
};

/**
 * 检查所有脚本是否已加载
 * @param callback 加载完成后的回调函数
 */
const checkAllScriptsLoaded = (callback: () => void) => {
  if (scriptLoadStatus.worldMap && scriptLoadStatus.chinaMap && scriptLoadStatus.initMap) {
    callback();
  }
};

/**
 * 初始化世界地图
 * @param container 地图容器元素
 * @param options 地图配置选项
 * @returns echarts 实例
 */
export const initWorldMap = (container: HTMLElement, options: any = {}) => {
  if (!window.echarts) {
    console.error('echarts is not loaded');
    return null;
  }

  const chart = window.echarts.init(container);

  const defaultOptions = {
    title: {
      text: '全球威胁情报分布',
      left: 'center',
      textStyle: {
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    visualMap: {
      min: 0,
      max: 100,
      text: ['高', '低'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
      }
    },
    series: [
      {
        name: '威胁情报',
        type: 'map',
        map: 'world',
        roam: true,
        emphasis: {
          label: {
            show: true
          }
        },
        data: []
      }
    ]
  };

  // 合并默认选项和自定义选项
  const mergedOptions = { ...defaultOptions, ...options };

  // 设置地图选项
  chart.setOption(mergedOptions);

  return chart;
};

/**
 * 初始化中国地图
 * @param container 地图容器元素
 * @param options 地图配置选项
 * @returns echarts 实例
 */
export const initChinaMap = (container: HTMLElement, options: any = {}) => {
  if (!window.echarts) {
    console.error('echarts is not loaded');
    return null;
  }

  const chart = window.echarts.init(container);

  const defaultOptions = {
    title: {
      text: '中国威胁情报分布',
      left: 'center',
      textStyle: {
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    visualMap: {
      min: 0,
      max: 100,
      text: ['高', '低'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
      }
    },
    series: [
      {
        name: '威胁情报',
        type: 'map',
        map: 'china',
        roam: true,
        emphasis: {
          label: {
            show: true
          }
        },
        data: []
      }
    ]
  };

  // 合并默认选项和自定义选项
  const mergedOptions = { ...defaultOptions, ...options };

  // 设置地图选项
  chart.setOption(mergedOptions);

  return chart;
};

/**
 * 使用地图的 React Hook
 * @param containerId 地图容器元素的 ID
 * @param mapType 地图类型，'world' 或 'china'
 * @param options 地图配置选项
 * @returns 地图实例的引用
 */
export const useMap = (containerId: string, mapType: 'world' | 'china' = 'world', options: any = {}) => {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // 加载地图脚本
    loadMapScripts(() => {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container with id ${containerId} not found`);
        return;
      }

      // 初始化地图
      if (mapType === 'world') {
        chartRef.current = initWorldMap(container, options);
      } else {
        chartRef.current = initChinaMap(container, options);
      }

      // 窗口大小变化时重新调整地图大小
      const handleResize = () => {
        if (chartRef.current) {
          chartRef.current.resize();
        }
      };

      window.addEventListener('resize', handleResize);

      // 清理函数
      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.dispose();
          chartRef.current = null;
        }
      };
    });
  }, [containerId, mapType, options]);

  return chartRef;
};
