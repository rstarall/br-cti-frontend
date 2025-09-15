'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Spin, Empty } from 'antd';

interface GraphNode extends d3.SimulationNodeDatum {
    id: string;
    name: string;
    properties?: Record<string, any>;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
}

interface GraphEdge extends d3.SimulationLinkDatum<GraphNode> {
    source: string | GraphNode;
    target: string | GraphNode;
    source_id: string;
    target_id: string;
    type: string;
    label?: string;
}

interface GraphData {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

interface KnowledgeGraphProps {
    data: GraphData;
    loading?: boolean;
}

const KnowledgeGraph = ({ data, loading = false }: KnowledgeGraphProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        try {
            // 清除旧图
            d3.select(svgRef.current).selectAll('*').remove();
            setError(null);

            // 检查数据是否有效
            if (!data || !data.nodes || !Array.isArray(data.nodes) || data.nodes.length === 0) {
                console.log('没有有效的节点数据:', data);
                return;
            }

            // 确保 edges 也是数组
            const nodes = data.nodes || [];
            const edges = Array.isArray(data.edges) ? data.edges : [];

            console.log('图谱数据:', { nodes: nodes.length, edges: edges.length });

            const width = svgRef.current.clientWidth || 800;
            const height = svgRef.current.clientHeight || 600;

            const svg = d3.select(svgRef.current)
                .attr('width', width)
                .attr('height', height);

            // 创建缩放行为
            const zoom = d3.zoom<SVGSVGElement, unknown>()
                .scaleExtent([0.1, 10])
                .on('zoom', (event: any) => {
                    g.attr('transform', event.transform);
                });

            svg.call(zoom);

            // 创建主图层
            const g = svg.append('g');

            // 添加箭头标记
            svg.append('defs').append('marker')
                .attr('id', 'arrowhead')
                .attr('viewBox', '-0 -5 10 10')
                .attr('refX', 20)
                .attr('refY', 0)
                .attr('orient', 'auto')
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .append('path')
                .attr('d', 'M 0,-5 L 10,0 L 0,5')
                .attr('fill', '#999');

            // 确保节点和边数据有效
            const validNodes = nodes.filter(node => node && node.id && node.name);

            // 处理边数据，转换为D3需要的格式
            const validEdges = edges.filter(edge => {
                if (!edge) return false;
                return edge.source_id && edge.target_id &&
                    validNodes.some(node => node.id === edge.source_id) &&
                    validNodes.some(node => node.id === edge.target_id);
            }).map(edge => ({
                ...edge,
                source: edge.source_id,
                target: edge.target_id,
                label: edge.type
            }));

            console.log('有效数据:', { validNodes: validNodes.length, validEdges: validEdges.length });

            // 如果没有有效节点，显示空状态
            if (validNodes.length === 0) {
                console.log('没有有效节点');
                return;
            }

            // 创建力导向模拟
            const simulation = d3.forceSimulation<GraphNode, GraphEdge>(validNodes)
                .force('link', d3.forceLink<GraphNode, GraphEdge>(validEdges)
                    .id((d: GraphNode) => d.id)
                    .distance(100))
                .force('charge', d3.forceManyBody().strength(-300))
                .force('center', d3.forceCenter(width / 2, height / 2))
                .force('collide', d3.forceCollide().radius(50));

            // 创建边
            const link = g.selectAll('.link')
                .data(validEdges)
                .enter()
                .append('g')
                .attr('class', 'link-group');

            link.append('line')
                .attr('class', 'link')
                .attr('stroke', '#999')
                .attr('stroke-opacity', 0.6)
                .attr('stroke-width', 1)
                .attr('marker-end', 'url(#arrowhead)');

            // 添加边上的文字
            link.append('text')
                .attr('class', 'link-label')
                .attr('dy', -5)
                .attr('text-anchor', 'middle')
                .attr('fill', '#666')
                .style('font-size', '8px')
                .text((d: any) => d.label || d.type || '');

            // 创建节点
            const node = g.selectAll('.node')
                .data(validNodes)
                .enter()
                .append('g')
                .attr('class', 'node')
                .call(d3.drag<SVGGElement, GraphNode>()
                    .on('start', dragStarted)
                    .on('drag', dragged)
                    .on('end', dragEnded));

            // 节点圆圈
            node.append('circle')
                .attr('r', 20)
                .attr('fill', (d: any, i: number) => d3.schemeCategory10[i % 10])
                .attr('stroke', '#fff')
                .attr('stroke-width', 2);

            // 节点文字
            node.append('text')
                .attr('dy', 30)
                .attr('text-anchor', 'middle')
                .text((d: GraphNode) => d.name || d.id)
                .attr('fill', '#333')
                .style('font-size', '10px');

            // 鼠标悬停显示详情
            node.append('title')
                .text((d: GraphNode) => {
                    const title = [d.name || d.id];
                    if (d.properties && typeof d.properties === 'object') {
                        Object.entries(d.properties).forEach(([key, value]) => {
                            title.push(`${key}: ${value}`);
                        });
                    }
                    return title.join('\n');
                });

            // 模拟更新函数
            simulation.on('tick', () => {
                link.selectAll('line')
                    .attr('x1', (d: any) => (d.source as GraphNode).x!)
                    .attr('y1', (d: any) => (d.source as GraphNode).y!)
                    .attr('x2', (d: any) => (d.target as GraphNode).x!)
                    .attr('y2', (d: any) => (d.target as GraphNode).y!);

                link.selectAll('text')
                    .attr('x', (d: any) => ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2)
                    .attr('y', (d: any) => ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2);

                node.attr('transform', (d: GraphNode) => `translate(${d.x},${d.y})`);
            });

            // 拖拽函数
            function dragStarted(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragEnded(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            // 自动调整缩放以适应视图
            const initialScale = 0.8;
            svg.call(zoom.transform, d3.zoomIdentity.scale(initialScale)
                .translate(width / 2 / initialScale - width / 2, height / 2 / initialScale - height / 2));
        } catch (err: any) {
            console.error('绘制图谱错误:', err);
            setError(err.message || '图谱渲染失败');
        }
    }, [data]);

    return (
        <div className="relative w-full h-full border rounded-md overflow-hidden bg-gray-50">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                    <Spin size="large" tip="加载中..." />
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                    <div className="text-center p-4">
                        <p className="text-red-500 mb-2">图谱渲染失败</p>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            )}

            {(!data || !data.nodes || !Array.isArray(data.nodes) || data.nodes.length === 0) && !loading && !error && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Empty description="暂无图谱数据" />
                </div>
            )}

            <svg ref={svgRef} className="w-full h-full" />
        </div>
    );
};

export default KnowledgeGraph; 