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

# bc-server/data_stat_handler

## POST 获取系统概览数据

POST /dataStat/getSystemOverview

> 返回示例

> 200 Response

```json
{
  "result": {
    "block_height": 521,
    "total_transactions": 8,
    "cti_value": 84,
    "cti_count": 7,
    "cti_transactions": 0,
    "iocs_count": 28,
    "account_count": 5
  }
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
|» result|object|true|none||none|
|»» block_height|integer|true|none||none|
|»» total_transactions|integer|true|none||none|
|»» cti_value|integer|true|none||none|
|»» cti_count|integer|true|none||none|
|»» cti_transactions|integer|true|none||none|
|»» iocs_count|integer|true|none||none|
|»» account_count|integer|true|none||none|

## POST 查询CTI汇总信息

POST /dataStat/queryCTISummaryInfo

> Body 请求参数

```json
{
  "limit": 10
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» limit|body|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "result": "[{\"cti_id\":\"022505060803058503\",\"cti_hash\":\"4f59ac2a417f6a4924fe8d6718115a2bcb2f55bb56abfe562f5e889789d6e51d\",\"cti_type\":2,\"tags\":[\"ip\",\"port\",\"payload\"],\"creator_user_id\":\"76ff09b73fb97a8298abe1afad0c3c27c4d7a4f4c03404e57683cf1a0a187370\",\"create_time\":\"2025-05-06 16:03:33\"},{\"cti_id\":\"022505060809945952\",\"cti_hash\":\"68506bbdc6d56c44fa80a9d128efbff1b35447bb62eefdabf077aef80a28acc1\",\"cti_type\":2,\"tags\":[\"ip\",\"port\",\"payload\",\"hash\"],\"creator_user_id\":\"76ff09b73fb97a8298abe1afad0c3c27c4d7a4f4c03404e57683cf1a0a187370\",\"create_time\":\"2025-05-06 16:09:43\"},{\"cti_id\":\"022505060824143263\",\"cti_hash\":\"f5afba8e57821fa0f91be2f06121c439d420411dcbc6f08a0772b53d49497e58\",\"cti_type\":2,\"tags\":[\"ip\",\"port\",\"payload\",\"hash\"],\"creator_user_id\":\"76ff09b73fb97a8298abe1afad0c3c27c4d7a4f4c03404e57683cf1a0a187370\",\"create_time\":\"2025-05-06 16:24:11\"},{\"cti_id\":\"022505060824682062\",\"cti_hash\":\"68506bbdc6d56c44fa80a9d128efbff1b35447bb62eefdabf077aef80a28acc1\",\"cti_type\":2,\"tags\":[\"ip\",\"port\",\"payload\",\"hash\"],\"creator_user_id\":\"76ff09b73fb97a8298abe1afad0c3c27c4d7a4f4c03404e57683cf1a0a187370\",\"create_time\":\"2025-05-06 16:24:08\"},{\"cti_id\":\"022505060826063857\",\"cti_hash\":\"5351bd9d016fd2b33670daae53f440326478fc0cac631ecd8f375f1df9ba3d62\",\"cti_type\":2,\"tags\":[\"ip\",\"port\",\"payload\",\"hash\",\"url\"],\"creator_user_id\":\"76ff09b73fb97a8298abe1afad0c3c27c4d7a4f4c03404e57683cf1a0a187370\",\"create_time\":\"2025-05-06 16:26:08\"},{\"cti_id\":\"022505060826325181\",\"cti_hash\":\"f5afba8e57821fa0f91be2f06121c439d420411dcbc6f08a0772b53d49497e58\",\"cti_type\":2,\"tags\":[\"ip\",\"port\",\"payload\",\"hash\"],\"creator_user_id\":\"76ff09b73fb97a8298abe1afad0c3c27c4d7a4f4c03404e57683cf1a0a187370\",\"create_time\":\"2025-05-06 16:26:06\"},{\"cti_id\":\"022505060826445422\",\"cti_hash\":\"68506bbdc6d56c44fa80a9d128efbff1b35447bb62eefdabf077aef80a28acc1\",\"cti_type\":2,\"tags\":[\"ip\",\"port\",\"payload\",\"hash\"],\"creator_user_id\":\"76ff09b73fb97a8298abe1afad0c3c27c4d7a4f4c03404e57683cf1a0a187370\",\"create_time\":\"2025-05-06 16:26:03\"}]"
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
|» result|string|true|none||none|

## POST 获取上链趋势数据

POST /dataStat/getUpchainTrend

> Body 请求参数

```json
{
  "time_range": "last_30_days"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» time_range|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "result": "{\"cti_upchain\":{\"2025-05-06\":7,\"2025-05-06 16\":7},\"model_upchain\":{\"2025-05-06\":1,\"2025-05-06 16\":1}}"
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
|» result|string|true|none||none|

## POST 获取攻击类型排行

POST /dataStat/getAttackTypeRanking

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "result": "{\"rankings\":[{\"type\":\"TRAFFIC\",\"count\":0},{\"type\":\"HONEYPOT\",\"count\":7},{\"type\":\"BOTNET\",\"count\":0},{\"type\":\"APP_LAYER\",\"count\":0},{\"type\":\"OTHER\",\"count\":0}]}"
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
|» result|string|true|none||none|

## POST 获取数据统计信息

POST /dataStat/getDataStatistics

> 返回示例

> 200 Response

```json
{
  "result": "{\"total_cti_data_num\":7,\"total_cti_data_size\":1913743,\"total_model_data_num\":1,\"total_model_data_size\":0,\"cti_type_data_num\":{\"Type_2\":7},\"model_type_data_num\":null,\"iocs_data_num\":{\"hash\":6,\"ip\":7,\"payload\":7,\"port\":7,\"url\":1}}"
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
|» result|string|true|none||none|

## POST 获取IOCs类型分布

POST /dataStat/getIOCsDistribution

> 返回示例

> 200 Response

```json
{
  "result": "{\"total_count_map\":{\"hash\":6,\"ip\":7,\"payload\":7,\"port\":7,\"url\":1},\"distribution\":{}}"
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
|» result|string|true|none||none|

# 数据模型

