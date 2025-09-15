'use client';

import React, { use, useState,useRef } from 'react';
import { Input, Button,Tag ,Form,List, Avatar, Dropdown, Menu, Modal, message } from 'antd';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import { MoreOutlined } from '@ant-design/icons';
import { useAgentStore,Agent } from '@/stores/agentStore';
import { useEffect } from 'react';

// 智能体编辑/创建 Modal 组件

interface AgentModalProps {
  open: boolean;
  onOk: (agent:Agent) => void;
  onCancel: () => void;
  agent?: Agent | null;
}

export const AgentModal: React.FC<AgentModalProps> = React.memo(({ open, onOk, onCancel, agent }) => {
  const [form] = Form.useForm();
  const [skills, setSkills] = useState<string[]>(agent?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  //组件相关
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (agent) {
      form.setFieldsValue(agent);
      setSkills(agent.skills || []);
    } else {
      form.resetFields();
      setSkills([]);
    }
  }, [agent, form, open]);

  const handleAddSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (removedSkill: string) => {
    setSkills(skills.filter(skill => skill !== removedSkill));
  };
  //支持移动
  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk({ ...agent, ...values, skills });
      form.resetFields();
      setSkills([]);
    } catch {}
  };

  return (
    <Modal
      open={open}
      title={agent ? '编辑智能体' : '创建智能体'}
      okText="确认"
      cancelText="取消"
      onOk={handleOk}
      onCancel={onCancel}
      modalRender={(modal) => (
        <Draggable
          bounds={bounds}
          nodeRef={draggleRef}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
      destroyOnClose
      style={{ top: 20 }}
    >
      <Form form={form} layout="vertical" initialValues={agent || {}}>
        <Form.Item label="ID" name="id">
          <Input disabled placeholder="自动生成或不可编辑" />
        </Form.Item>
        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input placeholder="输入名称" />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <Input.TextArea placeholder="输入描述" />
        </Form.Item>
        <Form.Item
          label="提示词"
          name="prompt"
          rules={[{ required: true, message: '请输入Agent的提示词' }]}
        >
          <Input.TextArea placeholder="请输入Agent的提示词" />
        </Form.Item>
        <Form.Item label="技能">
          <div style={{ marginBottom: 8 }}>
            {skills.map(skill => (
              <Tag
                key={skill}
                closable
                onClose={() => handleRemoveSkill(skill)}
                style={{ marginBottom: 4 }}
              >
                {skill}
              </Tag>
            ))}
          </div>
          <Input.Search
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onSearch={handleAddSkill}
            enterButton="添加"
            placeholder="输入技能后回车或点击添加"
          />
        </Form.Item>
        <Form.Item label="MCP列表" name="mcpList">
          <Input placeholder="用逗号分隔多个URL" />
        </Form.Item>
        <Form.Item label="头像" name="avatar">
          <Input placeholder="输入头像(emoji或图片URL)" />
        </Form.Item>
      </Form>
    </Modal>
  );
});



const AgentItem: React.FC<{ item: any }> = React.memo(({ item }) => {
  const [skillExpanded, setSkillExpanded] = React.useState(false);
  const [promptExpanded, setPromptExpanded] = React.useState(false);
  const {selectedAgentId, editAgent, deleteAgent,selectAgent } = useAgentStore();
  const [currentEditAgent,setCurrentEditAgent]= useState<Agent>({} as Agent);
  const [openAgentModal,setOpenAgentModal] = useState(false);
  const handleEdit = (agent:Agent) => {
      setCurrentEditAgent(agent); 
      setOpenAgentModal(true);     
  };
  const handleConfirmEdit = (agent: Agent) => {
    // 处理创建智能体的确认操作
    editAgent(agent.id,agent);
    message.success(`智能体 "${agent.name}" 编辑成功`);
  }

  const handleDelete = (agent: Agent) => {
    // 处理删除操作
      Modal.confirm({
        title: '确认删除',
        content: `确定要删除 "${agent.name}" 吗？`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          deleteAgent(agent.id);
        },
      });
  };
  const handleUseOrCancelAgent = (agent: Agent) => {
    // 处理使用智能体操作
    if(agent.id !== selectedAgentId) {
      selectAgent(agent.id);
      message.success(`已选择智能体: ${agent.name}`);
    }else{
      selectAgent("");
    }
  }

  return (
    <div className={`w-full hover:bg-gray-50 bg-white  border  border-2  p-4 pt-3
         rounded-md transition-shadow shadow-md cursor-pointer
         relative ${selectedAgentId === item.id ? 'border-blue-400' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{item.avatar}</span>
          <h3 className="text-lg font-bold text-indigo-700">{item.name}</h3>
        </div>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="edit" onClick={() => handleEdit(item)}>编辑</Menu.Item>
              <Menu.Item key="delete" onClick={() => handleDelete(item)}>删除</Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      </div>
      
      <p className="text-gray-800 mb-3">{item.description}</p>
      
      <div className='mt-2'>
        <button
          onClick={() => setSkillExpanded(!skillExpanded)}
          className="text-blue-600 text-sm"
        >
          {skillExpanded ? '收起技能' : '查看技能'}
        </button>
        {skillExpanded && (
          <div className="mt-2 flex flex-wrap gap-2">
            {item.skills.map((skill: string) => (
              <span key={skill} className="px-2 py-1 bg-blue-100  text-xs rounded-full">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className='mt-2'>
        <button
          onClick={() => setPromptExpanded(!promptExpanded)}
          className="text-blue-600 text-sm focus:outline-none"
        >
          {promptExpanded ? '收起提示词' : '查看提示词'}
        </button>
        {promptExpanded && (
          <div className="mt-2">
        <span className="font-semibold text-gray-600">提示词：</span>
        <span className="text-gray-800 text-sm break-all">{item.prompt}</span>
          </div>
        )}
      </div>

      <div className='flex items-center justify-between mt-2'>
        <div className='w-full flex justify-end items-center gap-2'>
            <div
             className={`px-2 py-1 text-sm 
                        rounded-md shadow-md cursor-pointer 
                        text-center transition-all duration-300
                        ${selectedAgentId === item.id ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white'}`}
             onClick={() => handleUseOrCancelAgent(item)}>
                {selectedAgentId==item.id?'取消':'使用'}
            </div>
        </div>
      </div>
      <AgentModal
        open={openAgentModal}
        onOk={(agent) => {
          handleConfirmEdit(agent);
          setOpenAgentModal(false);
        }}
        onCancel={() => {setOpenAgentModal(false);}}
        agent={currentEditAgent}
      />
    </div>
  );
});

export default function AgentSideContainer() {
  const [inputValue, setInputValue] = useState('');
  const { agents,createAgent, editAgent, deleteAgent } = useAgentStore();
  const [currentCreateAgent,setCurrentCreateAgent]= useState<Agent>({} as Agent);
  const [openAgentModal,setOpenAgentModal] = useState(false);
  const handleCreate = () => {
      // 处理创建智能体
      const newAgent: Agent = {
        id: Date.now().toString(),
        name: "新智能体",
        description: '新创建的智能体',
        prompt: '你是一个智能体',
        skills: [],
        mcpList: [],
        avatar: '🤖',
      };
      setCurrentCreateAgent(newAgent);
      setOpenAgentModal(true);
  };
  const handleConfirmCreate = (agent: Agent) => {
    // 处理创建智能体的确认操作
    createAgent(agent);
    message.success(`智能体 "${agent.name}" 创建成功`);
  }

  return (
    <div className="p-4 w-full h-full flex flex-col items-start justify-start overflow-hidden">
      <h1 className="text-xl font-semibold mb-4">智能体</h1>
      <div className='w-full flex items-center gap-1'>
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="输入智能体名称..."
                className='flex-1'
            />
            <button className='flex-2 px-2 py-1 bg-blue-500 text-white text-sm rounded-md shadow-md cursor-pointer text-center'>
              搜索
            </button>
            <button
              onClick={handleCreate}
              className="flex-2 px-2 py-1 bg-blue-500 text-white text-sm rounded-md shadow-md cursor-pointer text-center">
              创建
            </button>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={agents}
        renderItem={(item:Agent) => (
            <List.Item key={item.id}>
            <AgentItem item={item} />
            </List.Item>
          )}
          className="w-full h-[calc(100vh-200px)] scrollbar-none [&::-webkit-scrollbar]:hidden"
          style={{ overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          />
          <AgentModal
          open={openAgentModal}
          onOk={(agent) => {
          handleConfirmCreate(agent);
          setOpenAgentModal(false);
        }}
        onCancel={() => {setOpenAgentModal(false);}}
        agent={currentCreateAgent}
      />
    </div>
  );
}
