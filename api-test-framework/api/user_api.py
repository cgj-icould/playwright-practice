# api/user_api.py
from core.request_client import RequestClient

class UserApi:
    def __init__(self):
        self.client = RequestClient()

    def login(self, email, password):
        # 对应 reqres 的登录接口
        payload = {"email": email, "password": password}
        return self.client.send_request("POST", "/login", json=payload)

    def get_user(self, user_id):
        # 查询用户接口
        return self.client.send_request("GET", f"/users/{user_id}")