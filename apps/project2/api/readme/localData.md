---
title: br-cti
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# br-cti

Base URLs:

# Authentication

# client/data_handler

## POST 查询文件特征字段接口

POST /data/get_traffic_data_features

> Body 请求参数

```json
{
  "file_hash": "et tempor occaecat dolore"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» file_hash|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "data": "Throughput;Jitter;Response time;Class",
  "msg": "Get traffic data features name successfully"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|string|true|none||none|
|» msg|string|true|none||none|

## POST 上传数据集文件

POST /data/upload_file

> Body 请求参数

```yaml
file: cmMtdXBsb2FkLTE3MzM2NjM4NDYwMzgtMw==/SDN_data_set_raw.xlsx
task_id: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Content-Type|header|string| 否 |none|
|body|body|object| 否 |none|
|» file|body|string(binary)| 否 |文件|
|» task_id|body|string| 否 |任务ID|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "data": {
    "file_hash": "d8a3274fa87314fdffc4eb038639da7076b1e66098ebd397f941a5775d3aae1d",
    "file_size": 96625,
    "task_record": {
      "source_file_hash": "d8a3274fa87314fdffc4eb038639da7076b1e66098ebd397f941a5775d3aae1d",
      "step_status": [
        {
          "status": "finished",
          "step": 0,
          "total_num": 1
        }
      ],
      "task_id": "1001",
      "timestamp": 1733665039112
    }
  },
  "msg": "File uploaded successfully"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|object|true|none||none|
|»» file_hash|string|true|none||none|
|»» file_size|integer|true|none||none|
|»» task_record|object|true|none||none|
|»»» source_file_hash|string|true|none||none|
|»»» step_status|[object]|true|none||none|
|»»»» status|string|false|none||none|
|»»»» step|integer|false|none||none|
|»»»» total_num|integer|false|none||none|
|»»» task_id|string|true|none||none|
|»»» timestamp|integer|true|none||none|
|» msg|string|true|none||none|

## POST 数据集文件转换为STIX文件

POST /data/process_data_to_stix

> Body 请求参数

```json
{
  "process_id": "",
  "file_hash": ""
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» process_id|body|string| 是 |none|
|» file_hash|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "data": {
    "current_step": 0,
    "total_step": 3600
  },
  "msg": "Process data to stix successfully"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|object|true|none||none|
|»» current_step|integer|true|none||none|
|»» total_step|integer|true|none||none|
|» msg|string|true|none||none|

## POST 查询处理进度

POST /data/get_stix_process_progress

> Body 请求参数

```json
{
  "file_hash": ""
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» file_hash|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "data": {
    "current_step": 36,
    "current_task_id": 35,
    "errors": [],
    "progress": 100,
    "result": {
      "use_time": 3.5464870929718018
    },
    "total_step": 36,
    "total_task_list": [
      1,
      2
    ]
  },
  "msg": "Get stix process progress successfully"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» data|object|false|none||none|
|»» current_step|integer|true|none||none|
|»» current_task_id|integer|true|none||none|
|»» errors|[string]|true|none||none|
|»» progress|integer|true|none||none|
|»» result|object|true|none||none|
|»»» use_time|number|true|none||none|
|»» total_step|integer|true|none||none|
|»» total_task_list|[integer]|true|none||none|
|» msg|string|false|none||none|

## POST 查询stix记录表

POST /data/get_local_stix_records

> Body 请求参数

```json
{
  "file_hash": "",
  "page": "",
  "page_size": ""
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» file_hash|body|string| 是 |none|
|» page|body|string| 是 |none|
|» page_size|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "data": [
    {
      "create_time": "2024-12-08 22:06:42",
      "ioc_ips_map": {},
      "onchain": false,
      "source_file_hash": "d8a3274fa87314fdffc4eb038639da7076b1e66098ebd397f941a5775d3aae1d",
      "stix_file_hash": "f72a8da2f8aacd4f3eee2ea5afca2a7f84e3b62517293dd4fcb095e176749539",
      "stix_file_path": "D:\\Work\\program\\Python\\B&R_projiect\\br-cti-client\\data/output/d8a3274fa87314fdffc4eb038639da7076b1e66098ebd397f941a5775d3aae1d/f72a8da2f8aacd4f3eee2ea5afca2a7f84e3b62517293dd4fcb095e176749539.jsonl",
      "stix_file_size": 122110,
      "stix_iocs": [
        "ip",
        "port",
        "hash",
        "payload"
      ],
      "stix_tags": [
        "ip",
        "port",
        "hash",
        "payload"
      ],
      "stix_type": 1,
      "stix_type_name": "恶意流量"
    },
    {
      "create_time": "2024-12-08 22:06:42",
      "ioc_ips_map": {},
      "onchain": false,
      "source_file_hash": "d8a3274fa87314fdffc4eb038639da7076b1e66098ebd397f941a5775d3aae1d",
      "stix_file_hash": "dcf9867d413e9334064ef3fca4afd81efae7a9696f80209f68be01b88974b00f",
      "stix_file_path": "D:\\Work\\program\\Python\\B&R_projiect\\br-cti-client\\data/output/d8a3274fa87314fdffc4eb038639da7076b1e66098ebd397f941a5775d3aae1d/dcf9867d413e9334064ef3fca4afd81efae7a9696f80209f68be01b88974b00f.jsonl",
      "stix_file_size": 122108,
      "stix_iocs": [
        "ip",
        "port",
        "hash",
        "payload"
      ],
      "stix_tags": [
        "ip",
        "port",
        "hash",
        "payload"
      ],
      "stix_type": 1,
      "stix_type_name": "恶意流量"
    },
    ....
  ],
  "msg": "Get stix records successfully"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|[object]|true|none||none|
|»» create_time|string|true|none||none|
|»» ioc_ips_map|object|true|none||none|
|»» onchain|boolean|true|none||none|
|»» source_file_hash|string|true|none||none|
|»» stix_file_hash|string|true|none||none|
|»» stix_file_path|string|true|none||none|
|»» stix_file_size|integer|true|none||none|
|»» stix_iocs|[string]|true|none||none|
|»» stix_tags|[string]|true|none||none|
|»» stix_type|integer|true|none||none|
|»» stix_type_name|string|true|none||none|
|» msg|string|true|none||none|

## GET 查询stix文件内容

GET /data/get_stix_file_content/<source_file_hash>/<stix_file_hash>

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|source_file_hash|query|string| 否 |none|
|stix_file_hash|query|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 处理本地STIX数据，生成本地上链情报

POST /data/process_stix_to_cti

> Body 请求参数

```json
{
  "file_hash": "",
  "cti_type": "",
  "cti_name": "",
  "open_source": "",
  "cti_description": "",
  "default_value": ""
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» file_hash|body|string| 是 |none|
|» cti_type|body|string| 是 |none|
|» cti_name|body|string| 是 |none|
|» open_source|body|string| 是 |none|
|» cti_description|body|string| 是 |none|
|» default_value|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "data": {
    "current_step": 0,
    "total_step": 0
  },
  "msg": "start create local cti records by hash"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|object|true|none||none|
|»» current_step|integer|true|none||none|
|»» total_step|integer|true|none||none|
|» msg|string|true|none||none|

## POST 查询情报处理进度

POST /data/get_cti_process_progress

> Body 请求参数

```json
{
  "file_hash": ""
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» file_hash|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "data": {
    "current_step": 180,
    "current_task_id": "f9213b5ef1575311c82bd710c158b53ab8703719dfabba8ccfec9a83598475fb",
    "progress": 100,
    "total_step": 180,
    "total_task_list": []
  },
  "msg": "Get cti process progress successfully"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|object|true|none||none|
|»» current_step|integer|true|none||none|
|»» current_task_id|string|true|none||none|
|»» progress|integer|true|none||none|
|»» total_step|integer|true|none||none|
|»» total_task_list|[string]|true|none||none|
|» msg|string|true|none||none|

# 数据模型

