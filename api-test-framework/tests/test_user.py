import pytest
import yaml
import allure
from api.user_api import UserApi
from logger import logger

user_api = UserApi()

@allure.feature("用户模块")
class TestUser:
    
    def load_login_data():
        with open("data/login_data.yaml", "r", encoding="utf-8") as f:
            return yaml.safe_load(f)

    @allure.story("登录接口")
    @allure.title("测试登录场景: {case[case_name]}")
    @pytest.mark.parametrize("case", load_login_data())
    def test_login(self, case):
        logger.info(f"--- 正在执行用例: {case['case_name']} ---")
        
        with allure.step(f"调用登录接口，账号: {case['email']}"):
            response = user_api.login(case["email"], case["password"])
        
        with allure.step(f"断言状态码是否为 {case['expected_status']}"):
            assert response.status_code == case["expected_status"]

    @allure.story("查询用户")
    @allure.title("测试查询用户详情")
    def test_get_user_detail(self):
        with allure.step("发送查询请求"):
            response = user_api.get_user(2)
        with allure.step("验证返回状态码和数据"):
            assert response.status_code == 200
            assert response.json()["data"]["id"] == 2