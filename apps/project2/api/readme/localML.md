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

# client/ml_handler

## POST 创建模型训练任务

POST /ml/create_model_task

> Body 请求参数

```json
"{   \"code\": 400, \r\n    'error': 'file_hash and label_column are required', \r\n    \"data\": None}"
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» file_hash|body|string| 是 |none|
|» label_column|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "Model task created successfully",
  "data": {
    "current_step": "step_1",
    "total_step": 10,
    "request_id": "abc123"
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
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|
|»» current_step|string|true|none||none|
|»» total_step|integer|true|none||none|
|»» request_id|string|true|none||none|

## POST 上传数据集文件

POST /ml/upload_dataset_file

> Body 请求参数

```yaml
file: cmMtdXBsb2FkLTE3MzM2NDAwNTQ3OTAtMw==/SDN_data_set_raw.xlsx

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Content-Type|header|string| 否 |none|
|body|body|object| 否 |none|
|» file|body|string(binary)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "File uploaded successfully",
  "data": {
    "file_hash": "sha256_hash_value",
    "file_size": 123456
  }
}
```

> 400 Response

```json
{
  "code": 400,
  "error": "Invalid file type",
  "data": null
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» data|object|true|none||none|
|»» file_hash|string|true|none||none|
|»» file_size|integer|true|none||none|

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» error|string|true|none||none|
|» data|null|true|none||none|

## POST 创建模型上链信息文件

POST /ml/create_model_upchain_info

@ml_blue.route('/create_model_upchain_info', methods=['POST'])
def create_model_upchain_info():
    data = request.get_json()
    file_hash = data.get('file_hash')
    model_hash = data.get('model_hash')
    model_info_config = data.get('model_info_config')
    if not file_hash or not model_hash:
        return jsonify({"code":400,'error': 'file_hash and model_hash are required',"data":None})
    #入参类型进行判断
    if not isinstance(model_info_config, dict):
        return jsonify({"code":400,'error': 'model_info_config must be a dictionary',"data":None})
    
    if not isinstance(model_info_config.get("tags",[]), list):
        model_info_config["model_tags"] = list(model_info_config.get("tags",[]))
    value = model_info_config.get("value", 0)
    model_info_config["value"] = float(value) if value != '' else 0.0
        
    result,error = ml_service.createModelUpchainInfoFileSingle(file_hash,model_hash,model_info_config)
    if error:
        return jsonify({"code":400,'error': error,"data":None})
    return jsonify({"code":200,'msg': 'Create model result info file successfully', 'data': result})

def createModelUpchainInfoFileSingle(self,source_file_hash:str,model_hash:str,model_info_config:str)->bool:
        """
            创建模型上链信息文件
            param:
                - source_file_hash: 源文件hash
                - model_hash: 模型hash
                - model_info_config: 模型信息配置
            return:
                - model_upchain_info: 模型上链信息
                - error: 错误信息
        """
        try:
            ml_client_path = self.tiny_db.get_ml_client_path()
            print(f"source_file_hash: {source_file_hash},model_hash: {model_hash}")
            model_record = self.getModelRecordByHashAndHash(source_file_hash,model_hash)
            print(f"createModelUpchainInfoFileSingle model_record: {model_record}")
            model_info = model_record.get("model_info", {})
            model_upchain_info = {
                "model_hash": model_hash,
                "model_name": model_info.get("model_name",""),
                "creator_user_id": "",
                "model_data_type": model_info.get("model_data_type",1), # 默认为流量数据
                "model_type": model_info.get("model_type",1),
                "model_algorithm": model_info.get("model_algorithm",""),
                "model_train_framework": model_info.get("model_framework",""),
                "model_open_source": model_info.get("open_source",1),
                "model_features": model_info.get("features",[]),
                "model_tags": model_info_config.get("model_tags",[]),
                "model_description": model_info_config.get("description",""),
                "model_size": model_info.get("model_size",0),
                "model_data_size": model_info.get("data_size",0),
                "model_data_ipfs_hash": "",
                "value": model_info_config.get("value",0.0),
                "model_ipfs_hash": "",
                "ref_cti_id": model_info.get("cti_id","")
            }
            # 保存到文件
            model_upchain_info_path = f"{ml_client_path}/model_records/{source_file_hash}/{model_hash}.json"
            os.makedirs(os.path.dirname(model_upchain_info_path), exist_ok=True)
            save_json_to_file(model_upchain_info_path, model_upchain_info)
            print(f"save_json_to_file model_upchain_info: {model_upchain_info_path}")
            return model_upchain_info,None
        except Exception as e:
            logging.error(f"createModelUpchainInfoFile error:{e}")
            return None,str(e)

> Body 请求参数

```json
{
  "file_hash": "dataset_123456",
  "model_info_config": {
    "tags": [
      "tag1",
      "tag2"
    ],
    "value": 1000
  }
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

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

## POST 从IPFS下载数据集文件

POST /ml/download_dataset_from_ipfs

> Body 请求参数

```json
{
  "data_source_hash": "a1b2c3d4e5f6...",
  "ipfs_hash": "QmXyZ..."
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

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

## POST 获取文件下载进度

POST /ml/get_download_progress

> Body 请求参数

```json
{
  "data_source_hash": "a1b2c3d4e5f6..."
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "data": {
    "progress": 100
  },
  "msg": "success"
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
|»» progress|integer|true|none||none|
|» msg|string|true|none||none|

## POST 获取模型进度

POST /ml/get_model_progress

> Body 请求参数

```json
{
  "request_id": "req_123456"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "data": {
    "current_step": 7,
    "error": null,
    "message": "Model evaluation completed",
    "model_hash": null,
    "progress": 100,
    "request_id": "bc749b03-30cd-4e50-bfb9-a10ee2f066af",
    "results": {
      "Inertia": 0.09508007523664092,
      "Silhouette Score": 0.2195323525572465,
      "visualization_path": "f:\\CWord\\br-cti\\client\\ml/output/4e1e686454813df473557305b019e53b23a9b4ca926a5ee40d6e3bc0bb277f0c/save\\visualizations\\bc749b03-30cd-4e50-bfb9-a10ee2f066af_clustering_eval.png"
    },
    "source_file_hash": "4e1e686454813df473557305b019e53b23a9b4ca926a5ee40d6e3bc0bb277f0c",
    "stage": "Model Evaluation",
    "time": "2025-05-05 21:07:04",
    "total_step": 7
  },
  "msg": "Get model progress successfully"
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
|»» error|null|true|none||none|
|»» message|string|true|none||none|
|»» model_hash|null|true|none||none|
|»» progress|integer|true|none||none|
|»» request_id|string|true|none||none|
|»» results|object|true|none||none|
|»»» Inertia|number|true|none||none|
|»»» Silhouette Score|number|true|none||none|
|»»» visualization_path|string|true|none||none|
|»» source_file_hash|string|true|none||none|
|»» stage|string|true|none||none|
|»» time|string|true|none||none|
|»» total_step|integer|true|none||none|
|» msg|string|true|none||none|

## POST 通过hash获取模型进度

POST /ml/get_model_progress_by_hash

> Body 请求参数

```json
{
  "file_hash": "dataset_123456"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "data": {
    "current_step": 7,
    "error": null,
    "message": "Model evaluation completed",
    "model_hash": null,
    "progress": 100,
    "request_id": "bc749b03-30cd-4e50-bfb9-a10ee2f066af",
    "results": {
      "Inertia": 0.09508007523664092,
      "Silhouette Score": 0.2195323525572465,
      "visualization_path": "f:\\CWord\\br-cti\\client\\ml/output/4e1e686454813df473557305b019e53b23a9b4ca926a5ee40d6e3bc0bb277f0c/save\\visualizations\\bc749b03-30cd-4e50-bfb9-a10ee2f066af_clustering_eval.png"
    },
    "source_file_hash": "4e1e686454813df473557305b019e53b23a9b4ca926a5ee40d6e3bc0bb277f0c",
    "stage": "Model Evaluation",
    "time": "2025-05-05 21:07:04",
    "total_step": 7
  },
  "msg": "Get model progress list successfully"
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
|»» error|null|true|none||none|
|»» message|string|true|none||none|
|»» model_hash|null|true|none||none|
|»» progress|integer|true|none||none|
|»» request_id|string|true|none||none|
|»» results|object|true|none||none|
|»»» Inertia|number|true|none||none|
|»»» Silhouette Score|number|true|none||none|
|»»» visualization_path|string|true|none||none|
|»» source_file_hash|string|true|none||none|
|»» stage|string|true|none||none|
|»» time|string|true|none||none|
|»» total_step|integer|true|none||none|
|» msg|string|true|none||none|

## POST 通过id获取训练进度

POST /ml/get_train_progress_detail_by_id

> Body 请求参数

```json
{
  "request_id": "req_123456"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

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

## POST 获取训练过程图像

POST /ml/get_train_process_image

> Body 请求参数

```json
{
  "request_id": "req_123456"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "data": {
    "image_base64": "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aVNt2bJFV65c0aJFi8x9DAaDPvroI61du1aenp66dOmSevXqpT179mSrlgULFmjcuHEyGo2aPXu2AgMDNX36dF28eFENGjTQzp07H2nc1O0FU9/hPGvWLE2YMCFbtWYkdQLj/e5/HsptLVu21JdffpnhV2ahYGBgYIbvmJYefXKii4uLkpOT02xDCQD5DSuwACAfsfQhXZIuXbqkGTNmaO7cubpz544GDBigzz77zHy+e/fuCg8P1/Dhw9WwYUP169dPQ4YMUZEiRXKrdItStwmUpE8//VQNGzZUu3btdPXqVVWrVk2dOnVK16devXq6evWqnJyc0hy3FGBFRkbq+++/1/79+7V3714dPXrUvELLx8dHHTt2VN26dfXCCy/o+vXr6tevnz788MM046Y+hKWGPW+88YZWrlypjRs36u2339avv/5qcfuGq1evSrL8kt7Uv8esbjPxoG0Tk5KSlJKSkubdXR06dFCjRo30559/qlChQvrzzz+1Y8cORUdHm7cUKVCgQLqxRo8e/cB6AAAAADyc7t27a/78+WrTpo3Gjx+vIkWKaM2aNXr33Xd148YNVaxYUcuXL1eNGjV0+/btNH3btGmjOnXq6J133tH333+v5557TtWrV1e7du3UuHFj1axZM93zkSU3b97U0KFD9fXXX8vR0VFLly5VtWrVJN0LRhwcHNSvXz81bdpUnTp10qhRo7K8GmvZsmW6fv26JMloNOrbb7994K4R2WHpGSkxMVGSdPDgQVWqVCnT/pGRkRmOk9cSExPTrAzLzuTExx57TF26dMn5ogEghxBgAUA+khrOpH4w//zzz7Vw4ULzSqAKFSpozZo1atKkSbq+w4YNU9myZdW5c2d9+umnmjlzplq1aqVFixbp6tWrqlKlitzc3OTo6Jjpftqps9ouXLggX1/fDNulvg8rLi5OcXFxFmfD1axZUwUKFFCTJk3Uv39/Xbp0SZGRkbKzs9OcOXMs1uHk5KRixYpl+Lu5P8S5du1amn3ES5UqpY4dO+rll1/W008/rZCQEDVr1kwXL15Up06dzFsn/vnnn0pKStLJkyd14cIFGQyGNDPiZs6cqR07duj333/XggUL1L17d0nSmTNn1KlTJzk5Oemvv/6SZPkdZqkPSYULF840RPz7778VGxtr/vvOSOq9JyUlyWQymR9evL295e3tLUkqVKiQ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qlKliurVq6fNmzfL19dXGzdu1K5du9L1/f333yVJTzzxhEqWLClfX1+LXy4uLta7QUnx8fEKCgrStGnTstxn+PDhioqKkr+/v44cOaIuXbqoVKlSqlChgmbPnq1OnTpJkjZv3qwrV65YtV4AAHIaARYAPED//v21adOmXLnWyJEj9ddff6lMmTKaOHGixTaXLl3SU089pXfffVe7d+/WnTt3FBcXp8OHD2vQoEF66qmndOnSpVypFwAAAABy2v/+9z/VqFFDv//+u5o3b65XX331gX0++eQTSdLjjz+u4cOHpzlXoEAB9enTR5L01VdfpeubGmBVr149m5VnXXR0tBo2bKhvvvlGZcqUSVezJZcvX9aqVaskSd9++628vLzStXnnnXck3VuRlnpfAADkFwRYAJCBlJQUDR8+XDNnzsyV6/3yyy+aMmWKDAaD5s2bJ1dX13RtkpOT1a5dOx07dkze3t5atWqV4uLidOfOHc2fP18FChTQ8ePH1bJlSyUnJ+dK3QAAAACQkw4fPqwbN26ob9++2rhxo9zc3DJtHxYWZn5/VMeOHeXo6JiuzZtvvilJ2r59u/mdUakOHTokSapZs6YVqs+amzdv6rffflPjxo31yy+/qHz58g/s4+npqe3bt2v58uV68sknLba5/3eVlJRktXoBAMgNDnldAADYosjISHXs2FFbt26Vr69vjq9oio2NVVBQkFJSUtS9e3c1btzYYruNGzfqwIEDMhgMWrdunerXry9JcnR0VNeuXVW4cGG1adNGR48e1YYNGxQYGJijdQMAAABATitevLh++OEHNWnSJEvtjx07Zv4+o2er4sWLq1ixYrp27ZquXLmiEiVKSLo3aTA1/Ep93soNTk5OmjZtmvr27Zvl7evd3NzUqFGjTNscPnzY/H2pUqWyVSMAALmNFVgAYMHgwYO1detWBQQEaMuWLTl+vWHDhunUqVPy9fXVp59+mmG7tWvXSpIaNWpk8WHqlVdeUcmSJSXdW9EFAAAAAPlds2bNshxeSUozAbFKlSoZtitbtqwkKTQ01Hzsr7/+0t27d+Xg4KA1a9aodu3a8vT0VIECBVS9enWNHj1at27deoS7yFzx4sXVr18/q797ecWKFebxa9SoYdWxAQDIaQRYAGCBk5OTpk+frq1bt6pgwYI5eq29e/dqxowZkqS5c+dmer3Tp09L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AAAAAAAghenTp6tr164yM11xxRX6+eeftXnzZn300Ufy9/dX165dtXTp0iwr75FHHtGqVavk7++v7t27a8WKFdq7d6++/fZbFS9eXAkJCXrqqaf0zz//eB33zz//nPXTs2dPSVL16tVVtmzZLKszAGSnnBxEIEm//PKLbrjhBv300086dOiQYmNjtWLFCj388MN66aWXsqQMBhHkLzndhj3i4uLUrl077dmzJ0P7nzp1So0bN1bv3r21bt06xcbG6uDBg/ryyy9Vt25dbd++PdvqivQRwAIAAAAAAF4SExP1wgsvKCkpSWFhYfrzzz/VsmVLVa5cWV27dtW7776rhIQENzCUWb///rumTp0qPz8/TZ48WR988IFq1aql0qVLq3379vr+++8lSVFRURozZozXsWXLlk33ExISolGjRkmS3nnnHfn6+mZJnQEgO+X0IIK///5b7dq1U3x8vC699FKNGTNGmzdv1rfffqvChQvr3Xff1aRJk1IcxyACpCWn27BHfHy82rdvrz/++CPDxzzxxBOaN2+eJOnhhx/W8uXLtWLFCrVu3Vp79+7V/fffr8TExCyvK87OL7crAAAAAAAA8pZff/1V69evlyS98cYbCgsL89r+9NNP6+2339a8efO0adMmXXnllZkq74MPPpAkde3aVXfddVeK7Y0aNdJll12mHTt2aPny5ed07vfee09HjhzRLbfcohYtWmSqngCQE1IbROC5D1euXFkJCQnq0aOHevbsqblz52ZJmT179lRMTIwKFCigWbNm6aqrrnLLK1iwoFq3bq3//e9/atmypddAgLMFpI4fP84ggnwoN9qwJJ04cUJt27bV77//nuFjFi1a5C5R/Oijj+qrr75yt02YMEH16tXTihUrNHr0aHXq1CnL6oqMYQYWAAAAAADwEh4eLkkKCAjQQw89lGJ7cHCw7rvvPknKkjwW7733nkaPHq1evXqluU/BggUlSQkJCRk+7/79+zV06FBJ0sCBAzNXSQDIIRkZRFCsWDF3EEFmrV692r2Xd+vWzQ1eedx777266qqrtGPHDs2cOfOczs0ggvwpp9uwJO3Zs0d16tTR77//rrp166pLly4ZOu69996TdPo5Y8iQIV7b/Pz81Lt3b0nS559/niX1xLkhgAUAAAAAALysWbNGknTdddepUKFCqe5Tp04dSaeXncqsGjVqqEOHDik6uDwiIyO1ZcsWSVL58uUzfN4BAwYoKipKLVu2VP369TNdTwDICTk9iMBTnnR6BkpqHn744XMuj0EE+VdOt2FJ2rp1q7Zu3aoHHnhAc+bMUcmSJc96TFJSkmbMmCFJatmypYoWLZpin9atW6tAgQJaunSpjh8/niV1RcYRwAIAAAAAAF48Sc+vvvrqNPepVKmSJGnXrl3ZXp/JkycrNjZWktS8efMMHXPkyBF32aoXX3wx2+oGAFktpwcReMorU6aMqlSpkmXlMYgg/8rpNixJhQsX1rhx4zR+/Hh31vbZbN++XVFRUZJOL1ecGj8/P9WoUUNJSUlau3ZtltQVGUcACwAAAAAAeImMjJSU/mynIkWKSMr+AFZCQoIGDBggSapWrZqaNGmSoeM+++wzRUdHq06dOrrllluys4oAkKVyehBBdpTHIIL8LTcGwtSqVUsPPvjgOR3jqaeUdwbtwBsBLAAAAAAA4CUpKUmS0h3B7Nl27NixbK3LkCFDtGHDBkmnl6ByHOesx8THx+vjjz+WJL3wwgvZWj8AyGo5PYjgXMrbvXu3zOys52QQQf6WlwbCpMdTTynv1zW/IoAFAAAAAAC8+Pn5STqdoyIt/v7+kqSYmJhsq8e6devUt29fSVKbNm3UokWLDB33/fffKyIiQqVLl1bbtm2zrX4AkB1yehDBuZQXGxurU6dOpXs+BhEgLw2ESY+nnlLer2t+RQALAAAAAAB48XTUpDfbydPpk10BrOjoaLVt21axsbEqU6aMRowYkeFjP/vsM0nSI4884gbaAOBCkdODCM6lvIyUySAC5JWBMGfjqaeU9+uaXxHAAgAAAAAAXooXLy5J+ueff9Lc58iRI5LSD3JlxtNPP63169fLz89PEyZMcOt0Nrt379b8+fMlSQ888EC21A0AslNODyI4l/IyUiaDCJAXBsJkRPJZV3m9rvkVASwAAAAAAOClQoUKkqSdO3emuc/+/fslSSEhIVle/kcffaRvv/1WkvT+++/rpptuyvCx48aNk5mpSpUqqlmzZpbXDQCyW04PIjiX8s5WJoMIIOWNgTAZkXxwTF6va35FAAsAAAAAAHipU6eOJGnFihVp7rN48WJJUtmyZbO07OnTp6tHjx6SpEcffVTdunU7p+PHjh0riY5TABeunB5EcC7lna1MBhFAyv2BMBlVvnx59995va75FQEsAAAAAADgpVGjRpKkdevWacOGDanuM3v2bEnStddem2XlLl++XPfdd58SExNVv379c8p7JZ2u79q1ayVJbdq0ybJ6AUBOyulBBJ7y/v77byUkJKRbXmhoaLqd+AwigJS7A2HORWhoqCpXriwp/bouWbJEUu7WNb8igAUAAAAAALzUq1dPlSpVkiS9+eabKbYvXrxYS5culSQ1adIkS8pcs2aNmjRposjISFWsWFGTJ09WYGDgOZ0jPDxc0uklga655posqRcA5LScHkRw2223SZKOHz+uGTNmnHd5DCKAR24NhDkfnrr+8MMPqW7fsGGDOwMrt+uaH2VZACs+Pl4DBw5UtWrVFBgYqLJly6pPnz6Kjo7OqiK8/PTTT7rppptUoEABFS1aVA8++KB2796dLWUBAAAAALJHTr9LImMcx9Gzzz4rSRo/frzefvttmZkkacuWLXrooYckSZdcconuvfde97jExETt2bNHe/bs0YkTJzJc3qlTp9SqVSsdPXpUAQEB+vjjjxUdHa2dO3em+kmLp+P15ptvJk8FgAtWTg8iKFWqlBvESn6/99i1a5d+/vnns5bHIAJ45MZAmPPleaZZunSpfv/99xTbhw4dKkkqVKiQ6tevn6N1QxYFsOLj49WyZUv16dNHGzduVHx8vPbu3auBAweqSZMmiouLy4piXG+99ZbatGmjhQsXKiYmRsePH9f48eNVr149bd++PUvLAgAAAABkj5x+l8S5efbZZ1WvXj1J0muvvaZKlSrp5ptv1tVXX60dO3ZIkgYPHqyCBQu6x/zzzz8qV66cypUrpyFDhmS4rClTprjv83FxcWrevLkuu+yyND+piY2N1bx58yRJt9xyy3ldMwDkBTk9iECSunbtKklauHChunTp4v4G79+/X23atFFsbKwCAwPVsWPHNM/BIAJ45EYbPl8NGjRQjRo1JEkdOnTQ8uXL3W1ffPGFvvjiC3dbcHBwjtQJ/8mSAFavXr0UHh4uHx8fDR48WFFRUdq3b59atGihBQsWaODAgVlRjCRp8uTJ6tu3ryTpkUce0f79+xUVFaV+/fpp//79evLJJ7OsLAAAAABA9snJd0mcu4CAAIWHh6tly5aSpB07dmjBggWKi4uTr6+vBg0apEceeSRLytq0aVOmz7FgwQLFxMRIIoAF4MKXk4MIJOnee+91Awmf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6aef1g8//KBVq1bl3IUA/8/MVKhQIZUuXVrS6ZHQ0n8zVTwSEhLcmYcHDhxQp06ddP311+uPP/7QmjVrtHnzZklSmTJlMvygCWSVpKQkxcbG6rLLLlNAQIA7ICD5s4SnDfv6+rpt+Oabb9aKFSskScuXL3fbseecAICMee655/TII48oIiLC6/vExERJKTuhfHx8dPLkSc2aNUshISEaMGCAihQpov79+6t06dL67LPP5DiOXnjhBf31119upyqQU858DjizDTdo0ECzZ8/WwIEDVbp0aXeZ4kOHDmnXrl0qXrw4gVdkO88gwwIFCqhbt27as2ePOnXqdNbjChcurGeeeUaXX365du3apRkzZqhUqVIKDg52n5klKTg4WI0bN9bdd9+thIQEvfXWW9l9ScjHfvvtN1WvXl0dOnTQ7t275ePjk+F3sk8++UQjR45UUFCQ+vXrp/nz52vu3Lluzvlvv/1Ws2bNcgfkIn8hgIUM83SG1qtXTx06dFBcXJxGjx6trVu3av/+/Xr//ffVr18/1apVS48//rhmzZqVYhSf50c0MDBQ99xzj+6//36NGDFCa9euzfHrQf6Q2o/bgAEDNHbsWPn5+emhhx7S5s2b9cADD0iSTp06JUnq1auXJGnFihXpzkYJCgrSAw88oKJFi2rs2LGS6DRFznIcRydPntTBgwclSWXLlpX0Xzv0dDx5lsz0vKR/8803chxHBQoU0Lx587R69Wr3GNaVRlbwdBRlJCDq4+MjX19fbdy4UXFxce6IUum/+3hqbViSunXrpnLlymn+/Plavny5247PDOICAFK3fv16ffLJJ/r+++81Z84c976bPB9F8iWJkx+3a9culS9fXuvWrdMVV1yh1157TZLUunVrLVu2TIMHD1bp0qX1559/qlu3bu6gAyC7eGZre54DPCvFJH++9TwrlCpVyv3Os//atWt18OBBXXXVVSpXrlxOVRv5wLZt21J9Pva0zQoVKig4OFhxcXGKj48/6/muuuoqPfnkk+45goKCFBcX55XnW5IqV66sBx54QCVLltSMGTP07bffZtUlAV4KFy6sG264QbGxsXrjjTckZeyd7K+//tLw4cPlOI7eeOMNvfLKKypXrpzKlCmj22+/XaVKldLRo0f13XffaePGjdl9GciDeLNHmk6cOJHiO09AqkWLFrrzzjv1+++/Kzw8XGFhYerVq5eaNGmipKQkffXVV2rTpo1uuukmLVmyJNXzFytWTM8++6yio6P1008/Zeu1IP/yPLz98ccf7nKV3bt3V4UKFZSQkKCgoCB3iYikpCQFBAS4I6BKlSql8uXLq1ChQumWUbFiRTVu3Fhjx47VoUOH6DRFppjZOQVBk5KSFBIS4rb15MuveZbMlKTJkyfr8ssv10svvaSkpCQ99NBDOnjwoDp16qTo6GhNmTLFDeACmeFpw2cGQtNr10lJSTpx4oSKFCmiAgUKKCgoSAkJCUpKSnLb9sSJE1O04R07duiDDz5Qx44dJUnffffdOS2BBQD5XVJSkq666ip36dXhw4dry5Ytkk7nG1y9erUaNmyowYMHS/LudPXz81OpUqW0bt06tWzZUjt37lStWrU0adIk/fjjj6pdu7ak0x1THTt21Pfff69t27bl8BUiP/EsM+zr66ujR4+qX79+evjhh9WiRQs9++yz7mox6b2vedroNddcI19fX3cwmMf27dt1/Pjx7LsIXHSOHz+udu3a6cYbb9SUKVPOun9AQID8/f114MABRUVFSUr9OTooKMjtdzMzHTlyxO3PSM7Hx0e33HKL2rRpI0l69913WQUJWcrT5mrXrq1WrVqpSZMm6tGjR4aP3759uw4dOqTChQvrgQcecN//1q5dq3vuuUcHDx5UUFCQpk+frvDwcPfvAvkHvaxIVXh4uO677z6NGjVKhw8fdr8PCAiQdHqJqfbt26to0aIaOXKk1qxZoxdeeEHh4eFatGiR7rnnHgUHB+uvv/5K9+GwWrVqatasmb7++mvFxMRIyvgaqUBG7N+/X40bN1bjxo3djv1y5cqpd+/ekqQJEyZo6tSpiomJkY+Pj5sD4Oeff9aRI0dUuXJl+fn56dixY+45z3yJKVKkiK6//nolJCRo4sSJOXZtuPh4Xrp9fHz0999/a968ee73afHx8dHx48e1c+dOSdKVV17pfu/j46PVq1erUaNGat26tXbu3KnrrrtO8+bN05gxY1SsWDE9/vjjkqTx48dr3bp1Zy0PSE/yNrxq1So1bNjQTYSeHh8fH8XFxengwYOKjo5WYGCg/Pz83DbcsGFDtWnTRjt37lS9evU0e/ZsjRkzRhUqVJB0ehZWYGCgZs2apdmzZ0tKfQYuACB1b775poKCgrRo0SLNnTtXEREReuaZZ1SrVi3NmzdPEyZMUFxcnNe7XWBgoAICAuQ4joKDgzVgwAD3XVD6r8O1atWqOn78uP7991/uzchWnoFbn3zyicqXL6+33npLv/76q6ZOnapPP/1UnTt31l9//ZXuOVauXClJKl++vNc5Dxw4oNdee01169Z13yWBjNi1a5dWr16tw4cP66efftKxY8fcpQPT8v777yssLEyDBg2SlHbQtUKFCnrmmWckne7HW7JkiRzHSXGvLVWqlFq3bq0aNWpow4YN6tevXxZdHSCvJSufffZZhYeHq3r16hkemLt7925J0uWXX67AwECdOnVKv/32mx577DGtWLFCr7/+uh577DGZmcaPH+/ep5GPGPD/EhISzMxszZo1duWVV5rjONagQQOLiIhw99m5c6e1adPG3nrrLUtKSrJnn33WHMexl19+2Q4fPuzud+LECVuwYIH16NHDIiMj0y33k08+Mcdx7MsvvzQzs6SkpGy4OuRXI0eONMdxrF69ehYXF+e2r8jISLvxxhvNcRxr1KiRrVy50v2+R48e5jiOOY5jZcqUsauuusquvPJK69Gjh8XGxnqdPzEx0czMtm3bZgEBAda3b98cvT5cHDztyMzs6NGj9thjj5njOHbNNddYfHy8maV/b9y7d69VrlzZ/Pz8bObMmWZmduTIEevSpYvblgsXLmzff/+9e0xSUpLbnh999FFzHMfatm2bHZeHfODMNvzII4+4be/aa6+1ffv2pdjvTOHh4ebr62tVq1a1uLg4279/vz3zzDPueXx9fb3aaFJSkiUmJrrPL6+99po5jmM33XRTNl0lAFycYmJizMzsyy+/NMdxrHjx4hYQEODef59//nnbsWNHqse2bt3aHMexq666yiZNmmRmluLZZfr06VaoUCELCgpyn7mB7HDs2DHr3Lmz23abNm1qI0eOtJdfftluvvlm6969ux09ejTN40+ePGkVK1Y0x3Hszz//NDOzU6dO2VdffWWVKlVyz9utWzeLi4vLoavCxWDYsGFWvHhxCwsLs1GjRqW77+HDh+3hhx82x3GsRo0atnHjRjNL+zn633//dfe/5ZZbUmz33IuPHTtmffr0Mcdx7Jlnnkn3uRzILM+zhUdq/Rme7+bPn2/vv/+++/20adOsatWq5uPjYwMGDHC/L1OmjDmOYy+++KL9+++/aZ4XFx8CWPBy/Phxa926tfn4+Fj37t29tiUkJNjw4cPNcRwrUqSI7dmzx5YvX27VqlWzcuXK2fTp0919M3ID8eyzevVqCwgIsC5duridUMC5SK3deNrXRx99ZI7j2G233WaJiYlebfO3335zX0LeeecdGzp0qJUoUcL97s4777Rbb73VKlas6L7EP/nkk3bs2DGvshITE+3gwYNWvnx5AgA4J2feK9955x0LDAw0f39/K168uPn5+dnIkSPNLPUXFs/xS5cuNcdxLDQ01DZu3GhDhgyxkJAQty07jmP169d3j/O8cHuOX7JkidvGly1bZmap/10BZ0qrDQcGBtpjjz1mTZo0McdxrF+/fmc9x9ixY81xHKtYsaINGTLEq/02aNDAHYzgCYadWfaaNWvcl5pffvnFzNIPmAHAxepc7n3J950+fbp7D3ccxxo3bmyLFy9O9TjPc8LatWu9njX++usvr/2OHDliTz/9tDvA4OTJk+dxRUDG/Prrr1a0aFErWrSoDR8+3KKiotxtnucHjzOfI5KSkmzbtm0WEhJiVapUsX///demT59ut912m9vGa9WqZbNnz86JS8FFwnOPjYiIsFatWpnjONakSRPbtm2b1/Yz/fHHH3bdddeZ4zjWtWvXs5bzxx9/WPHixc1xHPvuu+/M7L/BBMlt2rTJDYgBOeGXX35x78UZeT758ccfLSQkxKpWrerVzxwVFWV169Y1x3GsXLly9uOPP2ZbnZH3EMCCa+XKldawYUNzHMcqV65sS5cuNTPvH705c+bY1VdfbYULF7bJkydbUlKSDRgwwPz8/Kxjx462d+9ed98///zTunfvbh06dLA//vgj3bKvvvpqa9WqlZnR2YSzS95Gkneyex4Ck/PMZOncubOZpXxRad++vdvx73kxadGihf3999/uuXft2mU9e/Z0t6f2Q3nixAm7/PLLrWnTpilGmgBn8swc8Zg8ebI72rNJkyb222+/2U8//WSO41jdunXdmbBp3R9Hjx5tjuPYlVdeaW+++abbVlu1amUjR460ypUrW/Hixe2nn35K9fjjx4+7M2aefPLJrL9gXHTO1oZ//vlnMzObOXOm+fv7W6VKlWz58uVmlnZw9MknnzTHcez222+3YcOGmeM41rx5c9u6dav9/fffVq1aNStRooSNHz8+1eNPnDhh3bp1M8dx7IEHHmBkNIB86XwGoGzcuNHuuusur4EDgYGB7r3cLPUBip7fgVdeecX8/f3dZ5H333/fvv76a/vyyy/d98tixYq5M7SA7BAbG+vOQrn55ptTBKw8++zYscPi4uLc9pv8eWbWrFnmOI6VKFHCfU/0rGTw2WefeZ2LwV7IKM/9c8KECVahQgULCQmxt99+O919T506ZW+++aYVKFDAwsLC3FU20nofPHHihL300kvmOI6VLl3aPU9a+yclJdGGka1OnDhh7dq1M8dx7JVXXjGzs/f3xsbGugMXR44c6bX/ggULLCQkxAoUKOC289dffz1brwF5BzmwIElatWqVXn31Vc2dO1flypXT1q1b9ddffykhIUF+fn7u+rl169ZVhQoVdOLECa1atUqO46h58+Zq0KCBJk6cqDlz5rhrnM6bN09Dhw7V2LFjFRgYmGbZkZGRCg0N1fr16908REBa9u7dq1deeUVfffWVpNNrku/du1f33HOPbrzxRq1YsUKSFB8fr8TERO3atUuSVKtWrVTP17NnTwUFBenkyZMqXry4Ro8erV9++UXXXHONu45v+fLl9fTTT+uOO+6QJI0cOdLrHElJSQoKClLBggXl6+uroKAgcrkhTclzBK1fv16NGjXSvffeq0KFCmn48OGaMGGCbr/9diUkJKh48eJav369PvnkE0lpr32+fv16SVKxYsXUtGlT3X333fruu+80adIktWvXTtWqVdOxY8e0evVqxcbGpjg+JCREd999t0JDQzVnzhwtXbpUEjkJkTozc9vwhg0bdNttt6Vow82aNdMPP/yg/v37KyEhQTt37tTw4cMl/ZdLIrmjR49q2bJlkqRmzZqpXbt2+uOPPzRlyhRVqlRJpUuXVtWqVXXo0CFt3brVrUdyISEhuv3221W6dGktXbpUc+bMyd7/IQAgD/L19VV0dLRefvllTZs2TZK8clCcee/cuHGjqlWrpmnTpikkJEQffvihmjRpori4OH311Vfas2ePpP/yW6Tm1VdfVffu3XXppZdq8+bN6tmzpzp16qTHH39cc+fOVfHixTV8+HC1atUq6y8Y+cbZnksDAgK0adMmSdI111yjsLAwSafzD82dO1evvPKKatasqTvvvFONGjXSwIEDJXk/X4eHh0uSTpw4obFjx0qSXnjhBUVEROjJJ5+U9F+OzdSeZ4D0tGzZUk2bNlVMTIwmTpyoxYsXS/K+R3tyYwUGBqpFixa6+eab9e+//2r48OFKTEyUj49Pqn8LISEhateunapXr659+/bpzTfflJT2343jOLRhnFVGc1ilJjEx0c1X/MUXX2jr1q3y8fFJN9/27Nmz9eeff6pSpUp68MEH3fvzrl279NprrykyMlItW7ZU+fLlderUKVWqVOm864cLTK6FzpDj4uLibPXq1bZ161Yz+2/E0F9//WW1a9e2gIAA++STTyw8PNxKly5tV155pdca5X///bdFRkbahAkT3NwsHl988YWFhobaHXfcYWvWrDGz00v5eEYsrV+/Pt26NW3a1GrXru01EgpIzfz5881xHHvttdfc74YOHWqO45i/v789/fTTXvvXqVPHHMexiRMnpnnOV155xR3BER4enupIpJiYGBsyZIg7unT16tVe20+cOGGhoaH28MMPM5IJZxUdHW3PP/+8OY5jl1xyifXp08e9Ny9cuNDat29vfn5+FhgYaH5+fla2bFn3fnxm+zp48KBVq1bNHMexV1991cz+W2/aM/Lu3XffNcdx7O677/b6PrnNmzfbnXfeaUFBQfbuu+9yL0a64uLi3CWhLrnkEnv55Zdty5YtZvZfG/b19bXg4GDr3bu3XXbZZebv7++O5j+zHW/atMkqVKhgjuPYhAkTvLZ5ZoJ7loRNvhymh6dN792715o1a2Z+fn42cODAVJdOAYCL2eHDh+2+++4zx3HsrrvucvNdxsbGprnMe+vWra1jx462bt06MzPbsmWL+x73xRdfpDqj1XMuz/08NjbWZsyYYR07drTy5cvbzTffbA0aNLA33njDaxk34Fwlz3eZ3j5m/70XBgcH2+OPP26dO3e2m2++2QoUKGDBwcFWvnx5K1mypNu+Pc8cnjb+448/utuaNWvmtdRafHw8uVZwXhITE91nUs+qRv7+/vbss8+mWNr9TCNGjLCSJUtawYIF7euvv3bPl5rY2Fg37YfjOF556oHcsGLFCncm9qOPPnrW/ZcsWWLBwcHmOI59//33tm/fPtuzZ4+b2/v222+3xMREW716NffjfIYAVj6yefNmu+aaa+yOO+7w+kMfPHiw3XzzzdatWzeLiYmxuLg4e+qpp8xxHHv99ddt//799txzz1nBggXttddes9jYWCtfvrw5jmOTJ082M7Pdu3fbgw8+aL6+vvbuu+/ayZMnbeXKlVayZEkrV65cumvsRkdH20033WRXXnklHf84K09y6RkzZrjfRUZG2t13322+vr5WunRpmzp1qpmZbd261c0DlF4b3L9/v11xxRXmOI7dd999tmHDhjTL9vf3txIlStiiRYvc7xMTE90X/T59+mTRleJitW7dOrv00kvNcRxr2bKlrVy50hITE23btm320ksvuXnYOnToYCdOnHBzAT388MOpnu/AgQP29NNPW7NmzWzOnDle2zwvNzt27HBfZDZt2mRm/70kJf896NGjh1t2QkICQSykacqUKeY4jvn5+dmnn35qZqc7PM9sw0eOHDEzs2+++cbNf3JmHkGz00mlJ0+ebFOmTLETJ054bfO0w507d1rhwoUtICDAa4DNmR599FFzHMc6depkZiT2BZD/fPrpp1auXDkrWLBgimXPZs2aZUOHDrX9+/e730VHR7v/9nSy/u9//3OXMj7bYMQzRUZGWnR0tPsbAJyv5P0DERERNmzYMPvyyy9t4sSJdujQITPz7syPjY11+yU8z77lypWzt99+2+bNm2d79uyxv//+2zp06JBiUK6Z2Z49e+y5557zWjI+MTGRZ2Kct+Rt2POM27dvXytevLhddtll7kDb1HKymZ1+/vUsjVm/fn333p1Wm9y2bZt16dLFfvvttyy/FuQ/33zzjd12220plmTN6D3x1KlTNmLECHfZP89SmGn1/a5atcoaN25sjuNYkSJFrHr16la6dGn3v3vyuyH/IYCVj6xbt84cx7F3333XzLxvGPHx8e7oPLPT66BXr17dChYs6OYGKlasmH3++ecWHR1tzz33nDmOY88++6x7nokTJ1r58uWtWrVqNnPmTDt27JgFBQV5dZieyXPTq1ChgrVs2dLM6GhC6jxt5e233zbHcWzXrl1m9t9L9uTJky0sLMx8fHzc0aarV6+20NBQu+qqq9zZLWn56quv3PX+hw0b5r7IJyQkuGV4cquEhoba7t27vY6fNGmSOY5z1lFRyH82btxou3btsoMHD5rZ6ZkmnpHRr776qp04ccJGjBhhV199tfti4skVZGY2duxYCwgIsKCgIBs3blyqZcTGxtqJEydSbXeJiYl25MgRu+mmmyw4ODjNPFhmZr1793YTVAPJ9enTx7p3727ff/+9mZn9+++/7uzVjh072tChQ+2aa65JtQ1Pnz7dqlevbo7jWKFChWzevHlmZuecL3D9+vV2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o0bZt99+m2obXr58uTVq1MgdGPP000+nuJ+e7d65du1a8/X1tSJFitg///yT6j4zZsxINccWAOQnCxcu9Jp15TiONW7c2N2ekQ4jTyBs/vz55ufnZ35+fubr6+vOhHUcx+655x7btm1btl0HLlx79+51Z4kkX27qXEydOtVdEebnn3/2ek6YOnWqm3PzyiuvTBFE3b9/vz3xxBPmOI6VLVvWbrvtNnfVA8/yg3Pnzj3/C0S+sm3bNuvUqZO7LKvnHnq2Z9dhw4a56ThSW7Z1yJAhVrhwYStUqJD17ds33XPFx8fbe++9Z35+fuY4Torcx0BW8/TzelY2chzHKlas6P77jjvuSHeCxJnmzJnjrt7hyR1P3xkyigBWPuLJVfHXX3+luv3DDz+0ypUr20svveR2jHoSoTuOYyNGjLD//e9/VqpUKXMcx4oXL26DBg1K8UDqucm9+eab5jiOPffcc2aW/otS8tk0QGo87coTiPUsXZl8GTSz0y9L9erV8xpt+s4779ikSZPcEUs+Pj5WtGhRGzlypJtLy3P+jRs3WrFixbxe+G+44QavTn9GiSCjIiMj7aqrrrKAgIAUD3fR0dH26aefmuM4duONN7ojnB3ndH7BgwcP2r///mtPP/20+6JSsmRJr6TSK1eudDvr0xsFuHz5citYsKCVL1/e9u7d69WGPf9Ono+INo7k9u/fbwEBAVasWDF3dp4nT6DZ6RyEBQsWdNcoT60Ne74vUKCAVa5c2c0juHz5crv11lvtzz//NLPU217ygTiO41jDhg1T7HPmyw9tGEB+lJiYaB988IF7zy1durS1bt3aQkNDrVixYjZp0iQzO/f8Ld988401btzYgoODrVSpUlarVi2v5xEgOU/g6dJLL3W/O59OyhEjRpifn5+VK1fOK1A6fvx4K1SokJUrV84doNW/f3+vY5OSkmzkyJHuUoOeATRhYWFuTnDgXEyZMsUuu+wyr9WD0nre9LT3Rx991Hx8fKxhw4ZeeQQ99+BTp05Z586dzcfHx2rVqmWzZ89O9bye861cudJat25t77//fpZeG3Cm5P2827Zts4oVK7rveldccYV9++23bv6rjDpx4oS78ktISIitWbPGzMg1iIwhgHWBSusHLb19hw8fbr6+vrZ06dJUjz106FCKEc09evRwH/hq1qxpCxcutC1btlijRo0sLCzM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TEy048ePW6dOncxxHLvzzjtzuvrIR5J36O/Zs8eef/55q1+/vtWuXdvat2+fYvT91q1brUGDBuY4jt1///1mlvrKGT/99JM5jmNBQUG2bNmys9aB2SvIapMmTbJrr73WfH197aWXXkp335iYGPv4448tMDDQ/Pz8bN68eWaW8aBqUlISz8DIEZ52tm/fPnvuuefMcRwLDQ31Sm1wPvfTU6dO2ebNm23p0qUpchsCWYkAVi45fPiwXXbZZe4LSL169WzIkCEplnqIiYnxuomMHj3a7bhcu3at1/k8HUV33313huvRv39/K1asmF1xxRUpZlmZpT8LpmXLltaqVSvyXSFNnge333//3RzHseDgYLcj3mPFihXu+rmeDvuxY8e6nfLp/Ygmb59xcXHWvXt3K1asmDmOY02bNrVRo0bZrl273P14wUFqNm7caOHh4V65psxOL292zz33uLl8PNPi3377ba/9PEGn9IKjJ06csL59+7ozV83MnnrqKXMcx3r37u31kpOQkGBz5861li1b2iWXXGKO49h7773nbuvdu7e7RFvywQfAmc4cGT1v3jyrXbu2OY5jfn5+FhQUZI7juMtHeZaqTEtCQoL9+eef1rZtW7djyjOT9p577nGP9fwtnDhxwkaPHu3OMEy+TNWCBQvsueees/nz52f5dQPAhcbzrLpp0yarVauW+fn52VNPPWX79+939+nXr587g8WT+9hzbPJnYs+gLs9sAJ5/kV2SkpLs3XffNR8fH/fZwvNOV7x4cbczPzEx0RISEmzcuHHu9jMDtJ42/Mknn5i/v78VK1bsnJe0AjIirXc2Txs8efKk9enTxwICAqxChQpu2oy0glKbNm2y++67zxzHsTvuuCPF+YCccOZ7X3pmzZplV111lbsix5QpU7K5dkDmEcDKRb/++qs9/fTTbgel4zhuvoiEhASvUf2LFi3yyovlOI5169bN63wLFiywUqVKmeM47jJAad3AkidLnTdvnrsmdYsWLeznn3+26OjoNOvtOWdqyxkCaWnVqpU5jmOPPvqomaV8oBsxYoTddttt5jiOFS5c2Jo1a+ZO2TdL/+U7+bZNmzZZ9+7drWTJkuY4jhUpUsR+/vnnLL4aXCz27NljrVq1spIlS1qXLl3cdjl9+nQ3N0/dunVt2rRptmzZMitQoID17dvXzMx27txprVq1sho1arjnSy1nRXIzZ850l11ds2aNVahQwfz8/NwXo+QvVFFRUTZnzhyrXbu21wjUxMRE27Rpk9cSmci/li1bZhMmTLB9+/Z5fZ/89/+ff/5xc6c4jmNNmjSxv//+27777jtzHMfKlSuXodmvnrZ27Ngx998HDx60G264wRzHsR9++CHFvh6TJk1K83x0rgLIL9Ib7OK5J3744YcWEBBg5cuXt2+//dbdPnnyZLviiiu8glPJ7/WJiYm2bds2t1OqX79+2XMRgJnFxsZ65b68//777ddff7UPPvjAmjdv7i7Blty///5rDz/8sDmOYzVr1kwxiGX37t126623uqsMZHSVA+B8eHK3J7+Peu7DixcvdmcMtm/fPsX25JKSkuz77793l2UbPXp0ivMC2Sl5W4uJibH58+fbmjVrbPPmzanOdD127Jg7CNFxHHe5VlYrQl5GACsXnPmjt3z5crvrrrvslVdeSbHvvn373Ic8T3L1ESNGmL+/v/n4+LjLBZqd7ux8/fXXzXEcq1GjhrvsX0ZmsKxfv97eeustK1SokDmOY2XLlrVHHnnEFi5cmGqdgdSk1k48P4KbN29227FnuZOkpCSv9nnkyBF76KGH3Ie/m2++2T755JMMl5/8XBs3brSRI0da+/bt3eAAkJrWrVunWOLy6NGjds8999igQYPc7xYvXmy+vr5Wr149917r+Xz33Xdm5h3YP3LkiB08eNDMUi4z6Plb6d+/vzmOYy1btkzxwJh8oEFauDfnT57/3+Pj490cmOXKlbMuXbp4dXZGRkbaq6++6rbT6tWr29dff+11roceesgcx7G2bdvapk2bzqkenjb67bffmuM4du2117p5CM/c58y6A0B+tmTJEouNjTWzlMH8EydO2B133GGO49i9997r5sPcs2eP16oFgwcPdvMLxsfH29GjR61Xr17m7+9vNWvWZJY2stX8+fMtLCzMihQpYp988onX8+o333zjLk310Ucfmdl/7fuPP/5wV8woV66cPf/88zZq1Cj7+uuv3VnipUuXTpH/CsgqmzdvtooVK1pgYKA7AOzM59XExET74IMPrGjRolakSBH78ccfU93PIyIiwr0/ly5d2itFCJBTvvjiC6tcubI7SeKSSy6xp556ytatW5di3xUrVljjxo3NcRx76KGHcqG2wLkhgJVHHD582O3o9Ojfv7/5+vqa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ZfT09GThwoX1+kAxA6gWi+WlM0iGDx+upypHF70N3rx5k+vWrWOfPn2YO3dupkyZkkmSJKHZbGb69OlloV/x1t2+fZs9e/bkqVOnSNpOq49rJqvFYmHRokXp5uYWqyb6smXLmCxZMubOnZt79uzR22/evElHR0e6u7vz2LFjsa5BOvDibQoODubKlSttEgtu3LjBNGnSUCnFS5cu8ddff7UpCbhkyRKeOnWKz549i/Oc165d02ta1KxZUw+6CiHE5yA4OPiN13owng2MASN3d3fOnDnzlZnMxmLrefLkiVVNI/p5ly5dqvuTixcvfqNrE+JFTpw4wezZs+sSlWTUjCmTycQaNWrwxIkTvHDhAmfOnKnXWytevLg+PjIykhEREaxTpw6VUuzYsaN+LSIigjNmzNCJYP3799fJM5LhLz4m/fr1o9lspouLC9u0acOQkBD92uXLl1m1alWaTCZWrVpVxsvEJ6V+/fo64dBIRozOaM/Hjh1jxowZuWDBgvd9iUJ8dD77AJbxxb9x4wYdHByYLl06Nm7cmO7u7lRKsWTJkty5c2es/cnng5UhISF6zauaNWvS399f72uxWLhp0yZdK33t2rWxzvOiazp06JDu8BiDpTJAKiwWC/fs2cN27drpgcwcOXLYLDz97NkzTpgwgWazmXXq1NHlBW/fvs02bdrQZDKxX79++iHvTbJUjQCWMQPgdcql3blzh7du3eK2bdt44sQJKbEm3imjrRozYBMlSqSzno2SJ8+ePWPXrl1pZ2fHuXPn2rx269YtVq9enW5ubroMp3HOefPmsXfv3i/Mzhbiv4orieDvv//mtGnTeOfOHU6aNEkv7nvz5k0qpZggQQLOmjVLz3ItV64cp0+fblPi5/jx4zoxxtXVVTo6QojPysGDB+np6UknJyfu2rWL5Jsn+BmZzGXLln1htQDj/nzu3DkdQGjbtu0L184iyfLly7NZs2ZSNUO8NWFhYZw8ebIeK3jw4AErV65MDw8PHj582GbfhQsXMkWKFFRKccaMGSSj2mloaChLlSpFpRQrV67MDRs28O7du/z999+ZIkUKuru76+TIW7duvffPKMSLGPfhmzdvskCBArraS+HChdm4cWN27txZt/kECRLo5AEZSxOfin/++YcuLi5USnHOnDlx7iPtWQhbn3UAK3qn5vLly8ySJQvNZjOVUsyQ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",
    "image_type": "png"
  },
  "msg": "获取训练过程图像成功"
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
|»» image_base64|string|true|none||none|
|»» image_type|string|true|none||none|
|» msg|string|true|none||none|

## POST 获取模型评估图像

POST /ml/get_model_evaluate_image

> Body 请求参数

```json
{
  "request_id": "req_123456"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» request_id|body|string| 是 |none|

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

## POST 通过id获取模型记录

POST /ml/get_model_record_by_request_id

> Body 请求参数

```json
{
  "request_id": "req_123456"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» request_id|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "data": {
    "created_time": "2025-05-05 21:07:04",
    "model_hash": "02db636b8299f6fd12651dab2a8aaf7eabe59d7526e31afb5c50fa3c00614ff7",
    "model_id": "032505051307008044",
    "model_info": {
      "created_time": "2025-05-05 21:07:03",
      "evaluation_results": {
        "Inertia": 0.09508007523664092,
        "Silhouette Score": 0.2195323525572465,
        "visualization_path": "f:\\CWord\\br-cti\\client\\ml/output/4e1e686454813df473557305b019e53b23a9b4ca926a5ee40d6e3bc0bb277f0c/save\\visualizations\\bc749b03-30cd-4e50-bfb9-a10ee2f066af_clustering_eval.png"
      },
      "feature_count": 12,
      "features": [],
      "model_algorithm": "KMeans",
      "model_data_type": 1,
      "model_framework": "scikit-learn",
      "model_hash": "02db636b8299f6fd12651dab2a8aaf7eabe59d7526e31afb5c50fa3c00614ff7",
      "model_name": "KMeans",
      "model_save_path": "f:\\CWord\\br-cti\\client\\ml/output/4e1e686454813df473557305b019e53b23a9b4ca926a5ee40d6e3bc0bb277f0c/save\\bc749b03-30cd-4e50-bfb9-a10ee2f066af-KMeans.joblib",
      "model_size": 1727,
      "model_type": 3,
      "output_dir_path": "f:\\CWord\\br-cti\\client\\ml/output/4e1e686454813df473557305b019e53b23a9b4ca926a5ee40d6e3bc0bb277f0c",
      "request_id": "bc749b03-30cd-4e50-bfb9-a10ee2f066af",
      "rows_count": 8,
      "source_file_hash": "4e1e686454813df473557305b019e53b23a9b4ca926a5ee40d6e3bc0bb277f0c",
      "target_column": "",
      "test_size": 0.2,
      "train_results": {
        "visualization_path": "f:\\CWord\\br-cti\\client\\ml/output/4e1e686454813df473557305b019e53b23a9b4ca926a5ee40d6e3bc0bb277f0c/save\\bc749b03-30cd-4e50-bfb9-a10ee2f066af_train_process.png"
      },
      "training_time": [
        0.149
      ]
    },
    "onchain": true,
    "request_id": "bc749b03-30cd-4e50-bfb9-a10ee2f066af",
    "source_file_hash": "4e1e686454813df473557305b019e53b23a9b4ca926a5ee40d6e3bc0bb277f0c",
    "status": "evaluate_success",
    "timestamp": 1746450461750
  },
  "msg": "Get model record successfully"
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
|»» created_time|string|true|none||none|
|»» model_hash|string|true|none||none|
|»» model_id|string|true|none||none|
|»» model_info|object|true|none||none|
|»»» created_time|string|true|none||none|
|»»» evaluation_results|object|true|none||none|
|»»»» Inertia|number|true|none||none|
|»»»» Silhouette Score|number|true|none||none|
|»»»» visualization_path|string|true|none||none|
|»»» feature_count|integer|true|none||none|
|»»» features|[string]|true|none||none|
|»»» model_algorithm|string|true|none||none|
|»»» model_data_type|integer|true|none||none|
|»»» model_framework|string|true|none||none|
|»»» model_hash|string|true|none||none|
|»»» model_name|string|true|none||none|
|»»» model_save_path|string|true|none||none|
|»»» model_size|integer|true|none||none|
|»»» model_type|integer|true|none||none|
|»»» output_dir_path|string|true|none||none|
|»»» request_id|string|true|none||none|
|»»» rows_count|integer|true|none||none|
|»»» source_file_hash|string|true|none||none|
|»»» target_column|string|true|none||none|
|»»» test_size|number|true|none||none|
|»»» train_results|object|true|none||none|
|»»»» visualization_path|string|true|none||none|
|»»» training_time|[number]|true|none||none|
|»» onchain|boolean|true|none||none|
|»» request_id|string|true|none||none|
|»» source_file_hash|string|true|none||none|
|»» status|string|true|none||none|
|»» timestamp|integer|true|none||none|
|» msg|string|true|none||none|

## POST 根据源文件hash获取模型训练记录列表

POST /ml/get_model_record_list_by_hash

{
  "file_hash": "dataset_123456"
}

> Body 请求参数

```json
{
  "file_hash": "dataset_123456"
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
  "data": [
    {
      "created_time": "2025-05-05 21:07:04",
      "model_hash": "02db636b8299f6fd12651dab2a8aaf7eabe59d7526e31afb5c50fa3c00614ff7",
      "model_id": "032505051307008044",
      "model_info": {
        "created_time": "2025-05-05 21:07:03",
        "evaluation_results": {
          "Inertia": 0.09508007523664092,
          "Silhouette Score": 0.2195323525572465,
          "visualization_path": "f:\\CWord\\br-cti\\client\\ml/output/4e1e686454813df473557305b019e53b23a9b4ca926a5ee40d6e3bc0bb277f0c/save\\visualizations\\bc749b03-30cd-4e50-bfb9-a10ee2f066af_clustering_eval.png"
        },
        "feature_count": 12,
        "features": [],
        "model_algorithm": "KMeans",
        "model_data_type": 1,
        "model_framework": "scikit-learn",
        "model_hash": "02db636b8299f6fd12651dab2a8aaf7eabe59d7526e31afb5c50fa3c00614ff7",
        "model_name": "KMeans",
        "model_save_path": "f:\\CWord\\br-cti\\client\\ml/output/4e1e686454813df473557305b019e53b23a9b4ca926a5ee40d6e3bc0bb277f0c/save\\bc749b03-30cd-4e50-bfb9-a10ee2f066af-KMeans.joblib",
        "model_size": 1727,
        "model_type": 3,
        "output_dir_path": "f:\\CWord\\br-cti\\client\\ml/output/4e1e686454813df473557305b019e53b23a9b4ca926a5ee40d6e3bc0bb277f0c",
        "request_id": "bc749b03-30cd-4e50-bfb9-a10ee2f066af",
        "rows_count": 8,
        "source_file_hash": "4e1e686454813df473557305b019e53b23a9b4ca926a5ee40d6e3bc0bb277f0c",
        "target_column": "",
        "test_size": 0.2,
        "train_results": {
          "visualization_path": "f:\\CWord\\br-cti\\client\\ml/output/4e1e686454813df473557305b019e53b23a9b4ca926a5ee40d6e3bc0bb277f0c/save\\bc749b03-30cd-4e50-bfb9-a10ee2f066af_train_process.png"
        },
        "training_time": [
          0.149
        ]
      },
      "onchain": true,
      "request_id": "bc749b03-30cd-4e50-bfb9-a10ee2f066af",
      "source_file_hash": "4e1e686454813df473557305b019e53b23a9b4ca926a5ee40d6e3bc0bb277f0c",
      "status": "evaluate_success",
      "timestamp": 1746450461750
    }
  ],
  "msg": "Get model records successfully"
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
|»» created_time|string|false|none||none|
|»» model_hash|string|false|none||none|
|»» model_id|string|false|none||none|
|»» model_info|object|false|none||none|
|»»» created_time|string|true|none||none|
|»»» evaluation_results|object|true|none||none|
|»»»» Inertia|number|true|none||none|
|»»»» Silhouette Score|number|true|none||none|
|»»»» visualization_path|string|true|none||none|
|»»» feature_count|integer|true|none||none|
|»»» features|[string]|true|none||none|
|»»» model_algorithm|string|true|none||none|
|»»» model_data_type|integer|true|none||none|
|»»» model_framework|string|true|none||none|
|»»» model_hash|string|true|none||none|
|»»» model_name|string|true|none||none|
|»»» model_save_path|string|true|none||none|
|»»» model_size|integer|true|none||none|
|»»» model_type|integer|true|none||none|
|»»» output_dir_path|string|true|none||none|
|»»» request_id|string|true|none||none|
|»»» rows_count|integer|true|none||none|
|»»» source_file_hash|string|true|none||none|
|»»» target_column|string|true|none||none|
|»»» test_size|number|true|none||none|
|»»» train_results|object|true|none||none|
|»»»» visualization_path|string|true|none||none|
|»»» training_time|[number]|true|none||none|
|»» onchain|boolean|false|none||none|
|»» request_id|string|false|none||none|
|»» source_file_hash|string|false|none||none|
|»» status|string|false|none||none|
|»» timestamp|integer|false|none||none|
|» msg|string|true|none||none|

## POST 获取特征列表

POST /ml/get_feature_list

> Body 请求参数

```json
{
  "file_hash": "dataset_123456"
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
  "data": "time;src;dst;device_type;sub_device_type;protocol;sport;dport;action;payload;url;attack",
  "msg": "Get  feature list successfully"
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

## POST 根据源文件hash创建模型上链信息文件

POST /ml/create_model_upchain_info_by_source_file_hash

根据源文件hash创建模型上链信息文件
#根据源文件hash创建模型上链信息文件
@ml_blue.route('/create_model_upchain_info_by_source_file_hash', methods=['POST'])
def create_model_upchain_info_by_source_file_hash():
    data = request.get_json()
    file_hash = data.get('file_hash')
    model_info_config = data.get('model_info_config')
    if not file_hash:
        return jsonify({"code":400,'error': 'file_hash is required',"data":None})
    #入参类型进行判断
    if not isinstance(model_info_config, dict):
        return jsonify({"code":400,'error': 'model_info_config must be a dictionary',"data":None})
    
    if not isinstance(model_info_config.get("tags",[]), list):
        model_info_config["model_tags"] = list(model_info_config.get("tags",[]))
    if not isinstance(model_info_config.get("value",0), int):
        model_info_config["value"] = int(model_info_config.get("value",0))
        
    result = ml_service.createModelUpchainInfoBySourceFileHash(file_hash,model_info_config)
    if not result:
        return jsonify({"code":400,'error': '创建模型上链信息文件失败',"data":None})
    return jsonify({"code":200,'msg': '创建模型上链信息文件成功', 'data': None})

> Body 请求参数

```json
{
  "file_hash": "dataset_123456",
  "model_info_config": {
    "tags": [
      "tag1",
      "tag2"
    ],
    "value": 1000
  }
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» file_hash|body|string| 是 |none|
|» model_info_config|body|object| 是 |none|
|»» tags|body|[string]| 是 |none|
|»» value|body|integer| 是 |none|

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

# 数据模型

