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

# bc-server/kp_handler

## GET 查询IOC地理分布

GET /kp/queryIOCGeoDistribution

> 返回示例

> 200 Response

```json
{
  "result": {
    "AU": {
      "New South Wales": 19
    },
    "BR": {
      "São Paulo": 33
    },
    "CA": {
      "Ontario": 34
    },
    "CN": {
      "Beijing": 33,
      "Guangdong": 25,
      "Shanghai": 31
    },
    "DE": {
      "Berlin": 36
    },
    "ES": {
      "Madrid": 17
    },
    "FR": {
      "Île-de-France": 25
    },
    "GB": {
      "England": 19
    },
    "IN": {
      "Maharashtra": 19
    },
    "IT": {
      "Lazio": 17
    },
    "JP": {
      "Tokyo": 32
    },
    "KR": {
      "Seoul": 24
    },
    "RU": {
      "Moscow": 18
    },
    "SG": {
      "Singapore": 30
    },
    "US": {
      "California": 25
    }
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
|» result|object|true|none||不完整|
|»» AU|object|true|none||none|
|»»» New South Wales|integer|true|none||none|
|»» BR|object|true|none||none|
|»»» São Paulo|integer|true|none||none|
|»» CA|object|true|none||none|
|»»» Ontario|integer|true|none||none|
|»» CN|object|true|none||none|
|»»» Beijing|integer|true|none||none|
|»»» Guangdong|integer|true|none||none|
|»»» Shanghai|integer|true|none||none|
|»» DE|object|true|none||none|
|»»» Berlin|integer|true|none||none|
|»» ES|object|true|none||none|
|»»» Madrid|integer|true|none||none|
|»» FR|object|true|none||none|
|»»» Île-de-France|integer|true|none||none|
|»» GB|object|true|none||none|
|»»» England|integer|true|none||none|
|»» IN|object|true|none||none|
|»»» Maharashtra|integer|true|none||none|
|»» IT|object|true|none||none|
|»»» Lazio|integer|true|none||none|
|»» JP|object|true|none||none|
|»»» Tokyo|integer|true|none||none|
|»» KR|object|true|none||none|
|»»» Seoul|integer|true|none||none|
|»» RU|object|true|none||none|
|»»» Moscow|integer|true|none||none|
|»» SG|object|true|none||none|
|»»» Singapore|integer|true|none||none|
|»» US|object|true|none||none|
|»»» California|integer|true|none||none|

## GET 查询IOC类型分布

GET /kp/queryIOCTypeDistribution

> 返回示例

> 200 Response

```json
{
  "result": {
    "ip_count": 85,
    "port_count": 134,
    "payload_count": 164,
    "url_count": 67,
    "hash_count": 122
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
|»» ip_count|integer|true|none||none|
|»» port_count|integer|true|none||none|
|»» payload_count|integer|true|none||none|
|»» url_count|integer|true|none||none|
|»» hash_count|integer|true|none||none|

## GET 查询攻击类型统计

GET /kp/queryAttackTypeStatistics

> 返回示例

> 200 Response

```json
{
  "result": [
    {
      "time": "2024-12-21 17:00:00",
      "stats": {
        "malicious_traffic": 0,
        "honeypot_info": 4,
        "botnet": 0,
        "app_layer_attack": 0,
        "open_source_info": 0,
        "total": 4
      }
    },
    {
      "time": "2024-12-22 13:00:00",
      "stats": {
        "malicious_traffic": 0,
        "honeypot_info": 0,
        "botnet": 0,
        "app_layer_attack": 0,
        "open_source_info": 18,
        "total": 18
      }
    },
    {
      "time": "2024-12-22 14:00:00",
      "stats": {
        "malicious_traffic": 0,
        "honeypot_info": 18,
        "botnet": 0,
        "app_layer_attack": 0,
        "open_source_info": 0,
        "total": 18
      }
    },
    {
      "time": "2024-12-22 15:00:00",
      "stats": {
        "malicious_traffic": 21,
        "honeypot_info": 54,
        "botnet": 0,
        "app_layer_attack": 0,
        "open_source_info": 0,
        "total": 75
      }
    },
    {
      "time": "2024-12-23 12:00:00",
      "stats": {
        "malicious_traffic": 0,
        "honeypot_info": 19,
        "botnet": 0,
        "app_layer_attack": 0,
        "open_source_info": 0,
        "total": 19
      }
    },
    {
      "time": "2024-12-23 13:00:00",
      "stats": {
        "malicious_traffic": 0,
        "honeypot_info": 6,
        "botnet": 0,
        "app_layer_attack": 0,
        "open_source_info": 0,
        "total": 6
      }
    },
    {
      "time": "2025-01-04 16:00:00",
      "stats": {
        "malicious_traffic": 0,
        "honeypot_info": 1,
        "botnet": 0,
        "app_layer_attack": 0,
        "open_source_info": 0,
        "total": 1
      }
    },
    {
      "time": "2025-03-13 16:00:00",
      "stats": {
        "malicious_traffic": 0,
        "honeypot_info": 7,
        "botnet": 0,
        "app_layer_attack": 0,
        "open_source_info": 0,
        "total": 7
      }
    },
    {
      "time": "2025-04-30 16:00:00",
      "stats": {
        "malicious_traffic": 0,
        "honeypot_info": 13,
        "botnet": 0,
        "app_layer_attack": 0,
        "open_source_info": 0,
        "total": 13
      }
    },
    {
      "time": "2025-05-05 20:00:00",
      "stats": {
        "malicious_traffic": 0,
        "honeypot_info": 3,
        "botnet": 0,
        "app_layer_attack": 0,
        "open_source_info": 0,
        "total": 3
      }
    },
    {
      "time": "2025-05-06 14:00:00",
      "stats": {
        "malicious_traffic": 0,
        "honeypot_info": 1,
        "botnet": 0,
        "app_layer_attack": 0,
        "open_source_info": 0,
        "total": 1
      }
    },
    {
      "time": "2025-05-06 16:00:00",
      "stats": {
        "malicious_traffic": 0,
        "honeypot_info": 7,
        "botnet": 0,
        "app_layer_attack": 0,
        "open_source_info": 0,
        "total": 7
      }
    }
  ]
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
|» result|[object]|true|none||none|
|»» time|string|true|none||none|
|»» stats|object|true|none||none|
|»»» malicious_traffic|integer|true|none||none|
|»»» honeypot_info|integer|true|none||none|
|»»» botnet|integer|true|none||none|
|»»» app_layer_attack|integer|true|none||none|
|»»» open_source_info|integer|true|none||none|
|»»» total|integer|true|none||none|

## GET 查询攻击IOC信息

GET /kp/queryAttackIOCInfo

> 返回示例

> 200 Response

```json
{
  "result": [
    {
      "ip_address": "36.99.136.136",
      "location": "RU,Moscow,Moscow",
      "attack_type": "蜜罐情报",
      "port": "",
      "hash": ""
    },
    {
      "ip_address": "36.99.136.129",
      "location": "DE,Berlin,Berlin",
      "attack_type": "蜜罐情报",
      "port": "",
      "hash": ""
    },
    {
      "ip_address": "192.168.0.238",
      "location": "FR,Île-de-France,Paris",
      "attack_type": "蜜罐情报",
      "port": "",
      "hash": ""
    },
    {
      "ip_address": "schedule.cantonfair.org.cn",
      "location": "IN,Maharashtra,Mumbai",
      "attack_type": "蜜罐情报",
      "port": "",
      "hash": ""
    },
    {
      "ip_address": "111.7.96.154",
      "location": "CN,Guangdong,Shenzhen",
      "attack_type": "蜜罐情报",
      "port": "",
      "hash": ""
    },
    {
      "ip_address": "36.99.136.128",
      "location": "CN,Guangdong,Shenzhen",
      "attack_type": "蜜罐情报",
      "port": "",
      "hash": ""
    },
    {
      "ip_address": "36.99.136.137",
      "location": "JP,Tokyo,Tokyo",
      "attack_type": "蜜罐情报",
      "port": "",
      "hash": ""
    },
    {
      "ip_address": "101.33.192.242",
      "location": "DE,Berlin,Berlin",
      "attack_type": "蜜罐情报",
      "port": "",
      "hash": ""
    },
    {
      "ip_address": "111.7.96.147",
      "location": "DE,Berlin,Berlin",
      "attack_type": "蜜罐情报",
      "port": "",
      "hash": ""
    },
    {
      "ip_address": "36.99.136.137",
      "location": "CN,Shanghai,Shanghai",
      "attack_type": "蜜罐情报",
      "port": "",
      "hash": ""
    }
  ]
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
|» result|[object]|true|none||none|
|»» ip_address|string|true|none||none|
|»» location|string|true|none||none|
|»» attack_type|string|true|none||none|
|»» port|string|true|none||none|
|»» hash|string|true|none||none|

## GET 查询流量类型比例信息

GET /kp/queryTrafficTypeRatio

> 返回示例

> 200 Response

```json
{
  "result": {
    "non_traffic_count": 61,
    "satellite_count": 0,
    "five_g_count": 17,
    "sdn_count": 0
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
|»» non_traffic_count|integer|true|none||none|
|»» satellite_count|integer|true|none||none|
|»» five_g_count|integer|true|none||none|
|»» sdn_count|integer|true|none||none|

## GET 查询流量类型数量时序信息

GET /kp/queryTrafficTimeSeries

> 返回示例

> 200 Response

```json
{
  "result": [
    {
      "timestamp": "2024-12-22 15:00:00",
      "data": {
        "0": 20,
        "1": 1
      },
      "total": 21
    },
    {
      "timestamp": "2024-12-23 12:00:00",
      "data": {
        "0": 19
      },
      "total": 0
    },
    {
      "timestamp": "2024-12-23 13:00:00",
      "data": {
        "0": 6
      },
      "total": 0
    },
    {
      "timestamp": "2025-01-04 16:00:00",
      "data": {
        "0": 1
      },
      "total": 0
    },
    {
      "timestamp": "2025-03-13 16:00:00",
      "data": {
        "0": 7
      },
      "total": 0
    },
    {
      "timestamp": "2025-04-30 16:00:00",
      "data": {
        "1": 13
      },
      "total": 0
    },
    {
      "timestamp": "2025-05-05 20:00:00",
      "data": {
        "0": 2,
        "1": 1
      },
      "total": 0
    },
    {
      "timestamp": "2025-05-06 14:00:00",
      "data": {
        "0": 1
      },
      "total": 0
    },
    {
      "timestamp": "2025-05-06 16:00:00",
      "data": {
        "0": 5,
        "1": 2
      },
      "total": 0
    }
  ]
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
|» result|[object]|true|none||none|
|»» timestamp|string|true|none||none|
|»» data|object|true|none||none|
|»»» 0|integer|true|none||none|
|»»» 1|integer|true|none||none|
|»» total|integer|true|none||none|

# 数据模型

