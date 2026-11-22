import pytest
import yaml
from api.user_api import UserApi

user_api = UserApi()

# 1. 读取 YAML 文件里的数据
def load_login_data():
    with open("data/login_data.yaml", "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

# 2. 使用数据驱动装饰器
@pytest.mark.parametrize("case", load_login_data())
def test_login(case):
    """测试登录功能（数据驱动）"""
    print(f"\n--- 正在执行用例: {case['case_name']} ---")
    
    # 调用接口，数据从 yaml 里取
    response = user_api.login(case["email"], case["password"])
    
    # 断言状态码是否与 yaml 里预期的一致
    assert response.status_code == case["expected_status"]

def test_get_user_detail():
    """正向用例：查询用户详情"""
    response = user_api.get_user(2)
    assert response.status_code == 200
    assert response.json()["data"]["id"] == 2