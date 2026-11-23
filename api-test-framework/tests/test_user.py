import os
import yaml
import pytest
from api.user_api import UserApi 
api = UserApi()
# 导入你框架里的登录请求方法

# 获取 YAML 文件的绝对路径
yaml_path = os.path.join(os.path.dirname(__file__), '../data/ai_login_test_data.yaml')

# 读取数据
with open(yaml_path, 'r', encoding='utf-8') as f:
    test_data = yaml.safe_load(f)

@pytest.mark.parametrize("case", test_data, ids=[case['case_name'] for case in test_data])
def test_login_api(case):
    """测试登录接口，数据由 AI 自动生成"""
    print(f"\n🧪 正在执行 AI 生成用例: {case['case_name']}")
    
    # 从 AI 生成的字典里提取参数
    req_data = case['request_data']
    expected_status = case['expected_status']
    
    # 发送请求
    response = api.login(email=req_data.get('email'), password=req_data.get('password'))
    
    # 断言状态码
    assert response.status_code == expected_status, \
        f"❌ 失败！预期 {expected_status}，实际 {response.status_code}。响应内容: {response.text}"
    
    print(f"✅ 通过！状态码: {response.status_code}")