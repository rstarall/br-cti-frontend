#!/usr/bin/env python3
"""
测试流式API的脚本
用于验证前端修改后是否能正确处理后端的SSE流式输出
"""

import asyncio
import json
import sys
import os

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.api.readme.service.chat_service import ChatService


async def test_stream_output():
    """测试流式输出功能"""
    print("开始测试流式输出...")
    
    # 创建聊天服务实例
    chat_service = ChatService()
    
    # 测试查询
    query = "什么是人工智能？"
    meta = {
        "use_graph": False,
        "db_id": "",
        "history_round": 5
    }
    
    print(f"查询: {query}")
    print(f"元数据: {meta}")
    print("-" * 50)
    
    try:
        # 获取流式响应
        async for chunk in chat_service.process_chat_stream(query, meta):
            # 解码字节数据
            chunk_str = chunk.decode('utf-8')
            print(f"原始数据: {chunk_str}")
            
            # 解析SSE格式
            if chunk_str.startswith('data: '):
                json_str = chunk_str[6:].strip()  # 移除 "data: " 前缀和换行符
                try:
                    data = json.loads(json_str)
                    print(f"解析后数据: {json.dumps(data, ensure_ascii=False, indent=2)}")
                    
                    # 检查关键字段
                    if 'status' in data:
                        print(f"状态: {data['status']}")
                    if 'retrieved_docs' in data and data['retrieved_docs']:
                        print(f"召回文档数量: {len(data['retrieved_docs'])}")
                        for i, doc in enumerate(data['retrieved_docs']):
                            print(f"  文档{i+1}: {doc.get('type', 'unknown')} - {doc.get('filename', doc.get('name', 'unknown'))}")
                    
                except json.JSONDecodeError as e:
                    print(f"JSON解析错误: {e}")
                    print(f"原始JSON字符串: {json_str}")
            
            print("-" * 30)
            
    except Exception as e:
        print(f"测试失败: {e}")
        import traceback
        traceback.print_exc()


async def test_with_knowledge_base():
    """测试带知识库的流式输出"""
    print("\n开始测试带知识库的流式输出...")
    
    chat_service = ChatService()
    
    query = "请介绍一下网络安全的基本概念"
    meta = {
        "use_graph": True,
        "db_id": "test_db",  # 假设的知识库ID
        "history_round": 5
    }
    
    print(f"查询: {query}")
    print(f"元数据: {meta}")
    print("-" * 50)
    
    try:
        async for chunk in chat_service.process_chat_stream(query, meta):
            chunk_str = chunk.decode('utf-8')
            
            if chunk_str.startswith('data: '):
                json_str = chunk_str[6:].strip()
                try:
                    data = json.loads(json_str)
                    
                    # 只打印关键信息
                    status = data.get('status', 'unknown')
                    print(f"状态: {status}")
                    
                    if status == 'generating' and 'retrieved_docs' in data:
                        docs = data['retrieved_docs']
                        if docs:
                            print(f"  召回了 {len(docs)} 个文档/节点")
                            for doc in docs:
                                doc_type = doc.get('type', 'unknown')
                                name = doc.get('filename') or doc.get('name', 'unknown')
                                print(f"    - {doc_type}: {name}")
                    
                    elif status == 'loading' and ('content' in data or 'response' in data):
                        content = data.get('content') or data.get('response', '')
                        print(f"  内容片段: {content[:50]}...")
                    
                except json.JSONDecodeError:
                    pass
                    
    except Exception as e:
        print(f"测试失败: {e}")


if __name__ == "__main__":
    print("SSE流式输出测试")
    print("=" * 60)
    
    # 运行基本测试
    asyncio.run(test_stream_output())
    
    # 运行知识库测试
    asyncio.run(test_with_knowledge_base())
    
    print("\n测试完成!")
