# ThreatRAG 聊天 API - 前端接口文档

## 📌 基本信息

**API Base URL:** `http://localhost:8006`

**认证方式:** 暂无（所有请求需提供 `user_id`）

**数据格式:** JSON

---

## 🚀 核心接口（必读）

### 1. 发送消息 - POST `/chat/stream`

**最重要的接口，支持两种使用方式：**

#### 方式 A: 自动创建会话（推荐用于首次对话）

```javascript
fetch('http://localhost:8006/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "用户输入的问题",
    user_id: 1,  // 当前登录用户的ID
    meta: {
      title: "会话标题",  // 可选
      system_prompt: "你是一个助手",  // 可选
      model_provider: "deepseek"  // 可选: openai/deepseek/ollama
    }
  })
})
```

#### 方式 B: 继续已有会话

```javascript
fetch('http://localhost:8006/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "继续提问",
    user_id: 1,
    thread_id: "已保存的会话ID"  // 来自首次对话的响应
  })
})
```

#### 响应格式（流式）

响应是 **逐行返回** 的 JSON，每行一个对象：

```javascript
// 第1行: 加载中
{"response": "正在", "status": "loading", "thread_id": "abc123..."}

// 第2行: 继续加载
{"response": "思考", "status": "loading", "thread_id": "abc123..."}

// 第3行: 完成
{"status": "finished", "thread_id": "abc123...", "history": [...]}
```

#### 前端处理示例

```javascript
async function sendMessage(query, threadId = null) {
  const response = await fetch('http://localhost:8006/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      user_id: getCurrentUserId(),
      ...(threadId && { thread_id: threadId })
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let sessionId = null;
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim());

    for (const line of lines) {
      const data = JSON.parse(line);
      
      // 保存会话ID（首次对话时）
      if (data.thread_id && !sessionId) {
        sessionId = data.thread_id;
        localStorage.setItem('current_session_id', sessionId);
      }

      // 实时显示AI回复
      if (data.response) {
        fullText += data.response;
        updateChatUI(fullText);  // 更新界面
      }

      // 对话完成
      if (data.status === 'finished') {
        console.log('对话完成', { sessionId, fullText });
        return { sessionId, fullText };
      }
    }
  }
}
```

---

### 2. 创建会话 - POST `/chat/sessions/create`

**可选接口，用于提前创建会话**

```javascript
fetch('http://localhost:8006/chat/sessions/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 1,
    title: "我的会话",  // 可选，最大50字符
    system_prompt: "你是一个助手"  // 可选
  })
})
```

**响应:**
```json
{
  "success": true,
  "session_id": "abc123-def456-...",
  "message": "会话创建成功"
}
```

---

### 3. 获取会话列表 - GET `/chat/sessions`

**查询参数:**
- `user_id` (必需): 用户ID
- `limit` (可选): 返回数量，默认50
- `offset` (可选): 偏移量，默认0

```javascript
fetch(`http://localhost:8006/chat/sessions?user_id=1&limit=20`)
  .then(res => res.json())
  .then(data => {
    console.log(data.sessions);  // 会话列表
  });
```

**响应:**
```json
{
  "success": true,
  "sessions": [
    {
      "session_id": "abc123...",
      "title": "威胁情报讨论",
      "created_at": "2025-10-16T14:30:00",
      "updated_at": "2025-10-16T15:00:00"
    }
  ],
  "total": 10
}
```

---

### 4. 获取会话详情 - GET `/chat/sessions/{session_id}`

**查询参数:**
- `user_id` (必需): 用户ID
- `include_messages` (可选): 是否包含消息，默认true

```javascript
fetch(`http://localhost:8006/chat/sessions/abc123?user_id=1&include_messages=true`)
  .then(res => res.json())
  .then(data => {
    console.log(data.session);  // 会话详情
    console.log(data.session.messages);  // 消息历史
  });
```

**响应:**
```json
{
  "success": true,
  "session": {
    "session_id": "abc123...",
    "title": "威胁情报讨论",
    "messages": [
      {
        "role": "user",
        "content": "什么是APT攻击？",
        "created_at": "2025-10-16T14:30:00"
      },
      {
        "role": "assistant",
        "content": "APT是...",
        "created_at": "2025-10-16T14:30:05"
      }
    ]
  }
}
```

---

### 5. 更新会话 - PUT `/chat/sessions/{session_id}`

```javascript
fetch('http://localhost:8006/chat/sessions/abc123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 1,
    title: "新标题"  // 可选，最大50字符
  })
})
```

---

### 6. 删除会话 - DELETE `/chat/sessions/{session_id}`

**查询参数:**
- `user_id` (必需): 用户ID
- `hard_delete` (可选): 是否物理删除，默认false（软删除）

```javascript
fetch(`http://localhost:8006/chat/sessions/abc123?user_id=1`, {
  method: 'DELETE'
})
```

---

## 💡 前端开发建议

### 1. 会话管理策略

```typescript
class ChatSessionManager {
  private currentSessionId: string | null = null;
  private readonly MAX_TITLE_LENGTH = 50;

  // 验证并截断标题
  private validateTitle(title: string): string {
    if (!title) return title;
    if (title.length > this.MAX_TITLE_LENGTH) {
      console.warn(`标题过长，已截断至 ${this.MAX_TITLE_LENGTH} 字符`);
      return title.substring(0, this.MAX_TITLE_LENGTH);
    }
    return title;
  }

  // 开始新对话
  async startNewChat(query: string, userId: number, title?: string) {
    const result = await this.sendMessage(query, userId, null, title);
    this.currentSessionId = result.sessionId;
    return result;
  }

  // 继续当前对话
  async continueChat(query: string, userId: number) {
    if (!this.currentSessionId) {
      return this.startNewChat(query, userId);
    }
    return this.sendMessage(query, userId, this.currentSessionId);
  }

  // 切换会话
  switchSession(sessionId: string) {
    this.currentSessionId = sessionId;
    localStorage.setItem('current_session_id', sessionId);
  }

  // 更新会话标题
  async updateSessionTitle(sessionId: string, userId: number, title: string) {
    const validatedTitle = this.validateTitle(title);
    
    const response = await fetch(`/chat/sessions/${sessionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        title: validatedTitle
      })
    });
    
    return await response.json();
  }

  // 发送消息
  private async sendMessage(
    query: string, 
    userId: number, 
    threadId?: string,
    title?: string
  ) {
    const body: any = { query, user_id: userId };
    
    if (threadId) {
      body.thread_id = threadId;
    } else if (title) {
      // 创建新会话时验证标题
      body.meta = { title: this.validateTitle(title) };
    }
    
    // ... 实现流式处理
  }
}
```

---

### 2. 数据持久化

```javascript
// 保存当前会话ID
localStorage.setItem('current_session_id', sessionId);

// 恢复会话
const lastSessionId = localStorage.getItem('current_session_id');
if (lastSessionId) {
  // 加载历史消息
  loadSessionHistory(lastSessionId);
}
```

---

### 3. 错误处理

```javascript
async function sendMessage(query, threadId) {
  try {
    const response = await fetch('/chat/stream', {
      method: 'POST',
      body: JSON.stringify({ query, user_id: 1, thread_id: threadId })
    });

    if (response.status === 404) {
      // 会话不存在，创建新会话
      console.log('会话已失效，创建新会话');
      return sendMessage(query, null);  // 不传 thread_id
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // 处理响应...
  } catch (error) {
    console.error('发送失败:', error);
    showError('发送消息失败，请重试');
  }
}
```

---

## 🎨 UI 组件建议

### 聊天界面布局

```
┌─────────────────────────────────────┐
│  [会话列表]  │  [聊天区域]          │
│              │                       │
│  会话1       │  User: 你好           │
│  会话2       │  AI: 你好！           │
│  会话3 ✓    │                       │
│              │  User: ...            │
│  [+ 新会话]  │  AI: ...              │
│              │                       │
│              │  [输入框____________] │
│              │  [发送] [清空]        │
└─────────────────────────────────────┘
```

### React 示例组件

```tsx
function ChatInterface() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // 发送消息
  const handleSend = async () => {
    const result = await sendMessage(input, currentSessionId);
    setCurrentSessionId(result.sessionId);
    // 更新消息列表...
  };

  // 创建新会话
  const handleNewSession = async () => {
    const result = await sendMessage('你好', null);
    setCurrentSessionId(result.sessionId);
    loadSessions();  // 刷新会话列表
  };

  return (
    <div className="chat-interface">
      <SessionList 
        sessions={sessions} 
        onSelect={setCurrentSessionId}
        onNew={handleNewSession}
      />
      <ChatArea 
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
      />
    </div>
  );
}
```

---

## 📊 数据流程图

```
用户操作           前端处理               API调用              后端处理
   │                  │                     │                     │
   │ 点击"发送"       │                     │                     │
   ├─────────────────▶│                     │                     │
   │                  │ 调用 sendMessage()  │                     │
   │                  ├────────────────────▶│ POST /chat/stream   │
   │                  │                     ├────────────────────▶│
   │                  │                     │                     │ 创建/获取会话
   │                  │                     │                     │ 生成回复
   │                  │                     │                     │
   │                  │   流式响应 ◀────────┤◀────────────────────┤
   │                  │   {"response": "..."}                     │
   │                  │                     │                     │
   │  实时显示 ◀──────┤                     │                     │
   │  AI回复          │ 更新UI              │                     │
   │                  │                     │                     │
   │                  │   {"status": "finished", "thread_id": "..."}
   │                  │                     │                     │
   │                  │ 保存 thread_id      │                     │
   │                  │ localStorage        │                     │
```

---

## ⚠️ 重要提示

### ✅ 必须做的事情

1. **保存 thread_id**: 首次对话后从响应中提取并保存
2. **错误处理**: 处理网络错误和 404（会话不存在）
3. **流式处理**: 使用 ReadableStream 逐行解析响应
4. **用户反馈**: 显示加载状态和错误提示
5. **标题长度限制**: 会话标题最大 50 字符，超出会自动截断

### ❌ 常见错误

1. **忘记保存 thread_id**: 导致每次都创建新会话
2. **不处理流式响应**: 只能看到最后的结果
3. **user_id 不匹配**: 尝试访问其他用户的会话
4. **未验证会话**: 使用已删除的 session_id
5. **标题过长**: 超过 50 字符会被截断，建议前端提前限制

---

## 🔧 调试工具

### 浏览器控制台测试

```javascript
// 测试发送消息
fetch('http://localhost:8006/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: '你好',
    user_id: 1
  })
}).then(res => res.body.getReader()).then(reader => {
  const decoder = new TextDecoder();
  reader.read().then(function processText({ done, value }) {
    if (done) return;
    console.log(decoder.decode(value));
    return reader.read().then(processText);
  });
});
```

---

## 📞 联系方式

遇到问题？
- 查看详细文档: `docs/chat-session-api.md`
- 查看完整示例: `docs/chat-session-quickstart.md`
- 查看工作流程: `docs/chat-api-workflow.md`

---

## 📝 快速参考

| 接口 | 方法 | 用途 | 必需参数 |
|------|------|------|---------|
| `/chat/stream` | POST | 发送消息 | `query`, `user_id` |
| `/chat/sessions/create` | POST | 创建会话 | `user_id` |
| `/chat/sessions` | GET | 会话列表 | `user_id` |
| `/chat/sessions/{id}` | GET | 会话详情 | `user_id` |
| `/chat/sessions/{id}` | PUT | 更新会话 | `user_id` |
| `/chat/sessions/{id}` | DELETE | 删除会话 | `user_id` |

---

**版本:** 1.0  
**更新时间:** 2025-10-16  
**兼容性:** 所有现代浏览器（支持 Fetch API 和 ReadableStream）

