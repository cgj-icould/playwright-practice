import json
import yaml
import os
from openai import OpenAI

# ================= 1. 配置百炼 API =================
# 请填入你在阿里百炼获取的 API Key
client = OpenAI(
    api_key="你的真实APIKEY", 
    # 阿里百炼兼容 OpenAI 的地址（北京地域）
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1", 
)

# ================= 2. 读取 Swagger 文档 =================
def get_api_schema(file_path, target_path):
    """从 swagger.json 中提取指定接口的详细信息"""
    with open(file_path, 'r', encoding='utf-8') as f:
        spec = json.load(f)
    
    # 获取所有路径
    paths = spec.get("paths", {})
    if target_path not in paths:
        raise ValueError(f"找不到接口路径: {target_path}")
    
    # 提取目标接口的 Post/Get 方法定义
    api_detail = paths[target_path]
    return json.dumps(api_detail, ensure_ascii=False, indent=2)

# ================= 3. 调用千问大模型生成用例 =================
def generate_test_cases(api_info, target_path):
    """发送 Prompt 给千问，强制输出 JSON"""
    
    prompt = f"""
    你是一个资深的测试开发工程师。
    这是接口的 Swagger 定义信息：
    {api_info}
    
    请针对这个接口（路径：{target_path}），使用等价类划分和边界值分析法，生成 10 条测试用例。
    
    【强制要求】
    1. 必须只输出一个 JSON 数组，不要输出任何其他文字。
    2. JSON 数组内每个对象需包含以下字段（根据接口参数动态生成）：
       - case_name: 用例名称（如"正向用例：正常登录"）
       - request_data: 请求体参数（一个字典/对象，包含 email, password 等）
       - expected_status: 预期 HTTP 状态码（整数，参考文档里的 responses）
    """

    print(f"⏳ 正在请求千问 AI 生成 [{target_path}] 的用例...")
    response = client.chat.completions.create(
        model="qwen-plus", # 阿里百炼的模型名，如 qwen-turbo, qwen-plus, qwen-max
        messages=[{"role": "user", "content": prompt}],
        # 强制 JSON 输出（千问支持这个参数）
        response_format={"type": "json_object"} 
    )
    
    return response.choices[0].message.content

# ================= 4. 保存为 YAML =================
def save_to_yaml(json_text, output_path):
    """解析 AI 返回的 JSON 并保存为 YAML"""
    try:
        data = json.loads(json_text)
        
        # 兼容不同大模型的返回结构，自动找到那个列表
        if isinstance(data, dict):
            for key, value in data.items():
                if isinstance(value, list):
                    data = value
                    break
        
        # 确保目录存在
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, allow_unicode=True, sort_keys=False)
        print(f"✅ 成功！用例已保存至: {output_path}\n")
        
    except json.JSONDecodeError:
        print("❌ 解析失败！AI 返回的内容不是 JSON:")
        print(json_text)

# ================= 5. 主程序执行 =================
if __name__ == "__main__":
    swagger_file = "swagger.json"
    
    # 我们指定要测试的接口路径
    target_endpoint = "/api/login" 
    
    try:
        # 1. 提取接口信息
        api_schema_str = get_api_schema(swagger_file, target_endpoint)
        
        # 2. 让 AI 生成用例
        json_result = generate_test_cases(api_schema_str, target_endpoint)
        
        # 3. 保存成 YAML（文件名可以根据接口名动态变）
        output_yaml = "data/ai_login_test_data.yaml"
        save_to_yaml(json_result, output_yaml)
        
    except Exception as e:
        print(f"💥 运行出错: {e}")