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

# bc-server/block_handler

## GET 查询链信息

GET /blockchain/queryChain

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "data": "{\"BCI\":{\"height\":516,\"currentBlockHash\":\"+hjUJs+0mWZjqYyH+Jh6WF9zoBx+I1OuZSHq2sD6PDA=\",\"previousBlockHash\":\"FTKNxZAvm3RsDzU4RHrNHURiPx9o/Xy091CF960p5SY=\"},\"Endorser\":\"172.22.232.42:7051\",\"Status\":200}"
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

## GET 查询区块信息

GET /blockchain/queryBlock/{blockID}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|blockID|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "data": "{\"data\": {\"data\": [{\"payload\": {\"data\": {\"actions\": [{\"header\": {\"creator\": {\"id_bytes\": \"LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNLakNDQWRDZ0F3SUJBZ0lSQU9vUjZpNmpoQ202ZW1lLytWMWliVU13Q2dZSUtvWkl6ajBFQXdJd2N6RUwKTUFrR0ExVUVCaE1DVlZNeEV6QVJCZ05WQkFnVENrTmhiR2xtYjNKdWFXRXhGakFVQmdOVkJBY1REVk5oYmlCRwpjbUZ1WTJselkyOHhHVEFYQmdOVkJBb1RFRzl5WnpFdVpYaGhiWEJzWlM1amIyMHhIREFhQmdOVkJBTVRFMk5oCkxtOXlaekV1WlhoaGJYQnNaUzVqYjIwd0hoY05NalV3TlRBMk1EY3lNekF3V2hjTk16VXdOVEEwTURjeU16QXcKV2pCck1Rc3dDUVlEVlFRR0V3SlZVekVUTUJFR0ExVUVDQk1LUTJGc2FXWnZjbTVwWVRFV01CUUdBMVVFQnhNTgpVMkZ1SUVaeVlXNWphWE5qYnpFT01Bd0dBMVVFQ3hNRllXUnRhVzR4SHpBZEJnTlZCQU1NRmtGa2JXbHVRRzl5Clp6RXVaWGhoYlhCc1pTNWpiMjB3V1RBVEJnY3Foa2pPUFFJQkJnZ3Foa2pPUFFNQkJ3TkNBQVFoWUZHWGFXSGcKc1MrcUt2c1FJUUZOOVZ1dm91bjA2Vi91K2twR3ZsUGRPcDhCY3VRVG1Hcng0bUdqSWN2VnYxcDRSTFNCazBxbApRcXBRRWJvdytZcktvMDB3U3pBT0JnTlZIUThCQWY4RUJBTUNCNEF3REFZRFZSMFRBUUgvQkFJd0FEQXJCZ05WCkhTTUVKREFpZ0NCK3J6RDIzUmhaekIxL2NFZjg3Z0lSc2gvcFZWNnQzT2VJRTByR2JpU3lFVEFLQmdncWhrak8KUFFRREFnTklBREJGQWlFQXZMYWFNMk5PSi9rbDNhaW1CMXY2b0ZTQXB4cFlGeVY5TVp2eUlFZTgyMW9DSUVHaApjcUhEZVRVUVMrOWlzVm96K2poM1B1NWozVFZSUkZJTzVYOGdhYWFZCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K\",\"mspid\": \"Org1MSP\"},\"nonce\": \"gHthgLI1RDKZoC+wI0NdgVZ5ZBu4mDd0\"},\"payload\": {\"action\": {\"endorsements\": [{\"endorser\": \"CgdPcmcxTVNQEqoGLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNLRENDQWM2Z0F3SUJBZ0lRVlhBNGlsdFp1aGYxVHVJVXpnSHFPekFLQmdncWhrak9QUVFEQWpCek1Rc3cKQ1FZRFZRUUdFd0pWVXpFVE1CRUdBMVVFQ0JNS1EyRnNhV1p2Y201cFlURVdNQlFHQTFVRUJ4TU5VMkZ1SUVaeQpZVzVqYVhOamJ6RVpNQmNHQTFVRUNoTVFiM0puTVM1bGVHRnRjR3hsTG1OdmJURWNNQm9HQTFVRUF4TVRZMkV1CmIzSm5NUzVsZUdGdGNHeGxMbU52YlRBZUZ3MHlOVEExTURZd056SXpNREJhRncwek5UQTFNRFF3TnpJek1EQmEKTUdveEN6QUpCZ05WQkFZVEFsVlRNUk13RVFZRFZRUUlFd3BEWVd4cFptOXlibWxoTVJZd0ZBWURWUVFIRXcxVApZVzRnUm5KaGJtTnBjMk52TVEwd0N3WURWUVFMRXdSd1pXVnlNUjh3SFFZRFZRUURFeFp3WldWeU1DNXZjbWN4CkxtVjRZVzF3YkdVdVkyOXRNRmt3RXdZSEtvWkl6ajBDQVFZSUtvWkl6ajBEQVFjRFFnQUVjRWZYaVJYdjZCOEEKeERGQlhiWDFqMVB6SDl4OU1Gb3JDeFArazdYaHlvbE1ERlRJRTdQanV1dkw0aGlnVVNTVHlubWxQWGZkeXNiego2dEVLVWJlUDk2Tk5NRXN3RGdZRFZSMFBBUUgvQkFRREFnZUFNQXdHQTFVZEV3RUIvd1FDTUFBd0t3WURWUjBqCkJDUXdJb0FnZnE4dzl0MFlXY3dkZjNCSC9PNENFYklmNlZWZXJkem5pQk5LeG00a3NoRXdDZ1lJS29aSXpqMEUKQXdJRFNBQXdSUUloQU4zTjM0c3ZYR0xJWlpac202OGFTZzBUYUxLbTRjL1FBRVJSUEVibDF2R3BBaUF3cGhzRQowQ1BYMkg0dDF2V0EzN1ZONUc0Ri9PMzdHbTd0Z1hveGc0b1d4dz09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K\",\"signature\": \"MEQCICVYD3v+m/PlarakvCVyx6gOi4ikDNrBbP6+xPGuuZ9rAiAJZnIkz275eJ8sQvq/M6UMcAvVn3gX5ORHWvmJc0BYwA==\"}],\"proposal_response_payload\": {\"extension\": {\"chaincode_id\": {\"name\": \"_lifecycle\",\"path\": \"\",\"version\": \"syscc\"},\"events\": null,\"response\": {\"message\": \"\",\"payload\": null,\"status\": 200},\"results\": {\"data_model\": \"KV\",\"ns_rwset\": [{\"collection_hashed_rwset\": [{\"collection_name\": \"_implicit_org_Org1MSP\",\"hashed_rwset\": \"CiIKIETmKnUw9BzoGcErlvydgTRGqK9BD+fEK86WJkNh1/eSCiIKIFAeHjQIoWKyhbQ2YaWhu3jaOZemhPNLYHBxtsRMO2OyEkQKICTid+qkOir3HkGDR/qvDvs/SCDvbEgR3+ZZ1+WUMP3dGiDMIh6ffyGFIb6nEjQabiLBZ5R8YOPkl1a6J0lwz8VPaRJECiBE5ip1MPQc6BnBK5b8nYE0RqivQQ/nxCvOliZDYdf3khogaVLt4CLLrpWeG0qg2tR+hbyeHk6djfzwiFB5NIgLvnUSRAogw4ZI8ZTrctF0wnFG9fxrfaXgc+OALU7OKFKwGMlXqM8aIAjafEXLIEN35+QiSc2lcT+oZRFt27TLWhlJsuW0OKarEkQKIKT8MgRMayyjT7EAozSY3N+zUWR1kSPdv6BG6Z2H33u+GiAtcYuIRz9j+TeEf5EROvz+GqcIytQS6jnso5to2VZAuxJECiCEk9IuIpMndz6PYeQaH2NQ6ZEY/2iKJTgnqdIJ6iptohogGKMI9IifTm1ctHhIjYoR39H7yYzHkKXlkfJ0xFB1t1ISRAogUB4eNAihYrKFtDZhpaG7eNo5l6aE80tgcHG2xEw7Y7IaIJkUMttz/t4T7b0qYbDg6SuxLzxIS+C2YMr4sMMe8UcG\",\"pvt_rwset_hash\": \"87x+yUlbCdWK3JNdSmQBpPlNw1iJb9i8pEw3FJnk1yw=\"}],\"namespace\": \"_lifecycle\",\"rwset\": {\"metadata_writes\": [],\"range_queries_info\": [],\"reads\": [{\"key\": \"namespaces/fields/main_contract/Sequence\",\"version\": null},{\"key\": \"namespaces/metadata/main_contract\",\"version\": null}],\"writes\": []}},{\"collection_hashed_rwset\": [],\"namespace\": \"lscc\",\"rwset\": {\"metadata_writes\": [],\"range_queries_info\": [],\"reads\": [{\"key\": \"main_contract\",\"version\": null}],\"writes\": []}}]}},\"proposal_hash\": \"NQcuLVEsadtqcLVWdZsH9bMIWrVpww/rmvDsHPfPiBY=\"}},\"chaincode_proposal_payload\": {\"TransientMap\": {},\"input\": {\"chaincode_spec\": {\"chaincode_id\": {\"name\": \"_lifecycle\",\"path\": \"\",\"version\": \"\"},\"input\": {\"args\": [\"QXBwcm92ZUNoYWluY29kZURlZmluaXRpb25Gb3JNeU9yZw==\",\"CAESDW1haW5fY29udHJhY3QaAzEuMEpWElQKUm1haW5fY29udHJhY3RfMS4wOmY3YzBiNjA3OGFjNTcwNmI0OWYxZWJjMjk5OGNjYTc2MDQ3NWY2ZmYxZWFkNTI4ZjQ2ZTcyYzk2YmI1ZjNhNDk=\"],\"decorations\": {},\"is_init\": false},\"timeout\": 0,\"type\": \"UNDEFINED\"}}}}}]},\"header\": {\"channel_header\": {\"channel_id\": \"mychannel\",\"epoch\": \"0\",\"extension\": {\"chaincode_id\": {\"name\": \"_lifecycle\",\"path\": \"\",\"version\": \"\"}},\"timestamp\": \"2025-05-06T07:29:16.911557508Z\",\"tls_cert_hash\": null,\"tx_id\": \"dd2c2b63d05768b06f86d323bf95803f862e1117211ca80dc625dc5796d67171\",\"type\": 3,\"version\": 0},\"signature_header\": {\"creator\": {\"id_bytes\": \"LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNLakNDQWRDZ0F3SUJBZ0lSQU9vUjZpNmpoQ202ZW1lLytWMWliVU13Q2dZSUtvWkl6ajBFQXdJd2N6RUwKTUFrR0ExVUVCaE1DVlZNeEV6QVJCZ05WQkFnVENrTmhiR2xtYjNKdWFXRXhGakFVQmdOVkJBY1REVk5oYmlCRwpjbUZ1WTJselkyOHhHVEFYQmdOVkJBb1RFRzl5WnpFdVpYaGhiWEJzWlM1amIyMHhIREFhQmdOVkJBTVRFMk5oCkxtOXlaekV1WlhoaGJYQnNaUzVqYjIwd0hoY05NalV3TlRBMk1EY3lNekF3V2hjTk16VXdOVEEwTURjeU16QXcKV2pCck1Rc3dDUVlEVlFRR0V3SlZVekVUTUJFR0ExVUVDQk1LUTJGc2FXWnZjbTVwWVRFV01CUUdBMVVFQnhNTgpVMkZ1SUVaeVlXNWphWE5qYnpFT01Bd0dBMVVFQ3hNRllXUnRhVzR4SHpBZEJnTlZCQU1NRmtGa2JXbHVRRzl5Clp6RXVaWGhoYlhCc1pTNWpiMjB3V1RBVEJnY3Foa2pPUFFJQkJnZ3Foa2pPUFFNQkJ3TkNBQVFoWUZHWGFXSGcKc1MrcUt2c1FJUUZOOVZ1dm91bjA2Vi91K2twR3ZsUGRPcDhCY3VRVG1Hcng0bUdqSWN2VnYxcDRSTFNCazBxbApRcXBRRWJvdytZcktvMDB3U3pBT0JnTlZIUThCQWY4RUJBTUNCNEF3REFZRFZSMFRBUUgvQkFJd0FEQXJCZ05WCkhTTUVKREFpZ0NCK3J6RDIzUmhaekIxL2NFZjg3Z0lSc2gvcFZWNnQzT2VJRTByR2JpU3lFVEFLQmdncWhrak8KUFFRREFnTklBREJGQWlFQXZMYWFNMk5PSi9rbDNhaW1CMXY2b0ZTQXB4cFlGeVY5TVp2eUlFZTgyMW9DSUVHaApjcUhEZVRVUVMrOWlzVm96K2poM1B1NWozVFZSUkZJTzVYOGdhYWFZCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K\",\"mspid\": \"Org1MSP\"},\"nonce\": \"gHthgLI1RDKZoC+wI0NdgVZ5ZBu4mDd0\"}}},\"signature\": \"MEUCIQDFignN8bMQNvsppLuh9//qa9vJy5DbdFSs9DVmnSKboAIgeWLND++cAKUedMyS2rrhD5AHV8FOjtPAVX7K1Fv8e9s=\"}]},\"header\": {\"data_hash\": \"OmOFWfLh/Fw/RtbjJZQs+7WipfiH41j+Xt+AE4ViNhs=\",\"number\": \"3\",\"previous_hash\": \"IyKaQ/vAUdB6V8lRdhsTBaccj8OCpuM58xZwWQ9aW38=\"},\"metadata\": {\"metadata\": [\"Cg8KAggCEgkKBwoBARACGAUSkgcKxgYKqQYKCk9yZGVyZXJNU1ASmgYtLS0tLUJFR0lOIENFUlRJRklDQVRFLS0tLS0KTUlJQ0hUQ0NBY1NnQXdJQkFnSVFJclhNakdRVjRDcjkxVWNOZHJ0LzRUQUtCZ2dxaGtqT1BRUURBakJwTVFzdwpDUVlEVlFRR0V3SlZVekVUTUJFR0ExVUVDQk1LUTJGc2FXWnZjbTVwWVRFV01CUUdBMVVFQnhNTlUyRnVJRVp5CllXNWphWE5qYnpFVU1CSUdBMVVFQ2hNTFpYaGhiWEJzWlM1amIyMHhGekFWQmdOVkJBTVREbU5oTG1WNFlXMXcKYkdVdVkyOXRNQjRYRFRJMU1EVXdOakEzTWpNd01Gb1hEVE0xTURVd05EQTNNak13TUZvd2FqRUxNQWtHQTFVRQpCaE1DVlZNeEV6QVJCZ05WQkFnVENrTmhiR2xtYjNKdWFXRXhGakFVQmdOVkJBY1REVk5oYmlCR2NtRnVZMmx6ClkyOHhFREFPQmdOVkJBc1RCMjl5WkdWeVpYSXhIREFhQmdOVkJBTVRFMjl5WkdWeVpYSXVaWGhoYlhCc1pTNWoKYjIwd1dUQVRCZ2NxaGtqT1BRSUJCZ2dxaGtqT1BRTUJCd05DQUFRNld0Y2ZWWEZhRnFmYWpiWlVvcVZPb0tROAp6Z2xiQnE3UHdRelRqSWxrZEdTT05lR0F2WDZoaVRZSUVqTlNlNVBPS29rR1dsdkQ2emJ0Q29LSVg0eXVvMDB3ClN6QU9CZ05WSFE4QkFmOEVCQU1DQjRBd0RBWURWUjBUQVFIL0JBSXdBREFyQmdOVkhTTUVKREFpZ0NCZTlLSDkKL0Jsa1lMNjFQQnNDRVVaMWhSR1h0SEpGRGlKUnQvTzA3b01YcURBS0JnZ3Foa2pPUFFRREFnTkhBREJFQWlBMAp1NzMrU2FlaUwzbDZhdVllTHZKejhXU3FFQkx3Y2hxRDdzaytHT1dzTXdJZ2E5dVIvMUZ4NVl4b05rOXJxRC91Cm0zbU1qVVZyM3lQaUFndHlNNkVzTDVZPQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tChIYNfYSBO67E1MxlgswyhNW2+WP5OR/EM2pEkcwRQIhAKRR+yfvULL28zNMVBTr3ep++F0cTSn3TvvQAFdjIIV3AiAmYq7/FsDKDzi/1ljYUruxCy20JVZgL6Ul2BQhcXHsdg==\",\"CgIIAg==\",\"AA==\",\"\",\"CiDpUzTjAArp53D1Ocf/SctOs2Pnx7zQLaWOCDIv/i4uhw==\"]}}"
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

# 数据模型

