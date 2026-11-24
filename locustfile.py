from locust import HttpUser, task, between

class LoginUser(HttpUser):
    host = "127.0.0.1:5000"
    # 模拟用户思考时间，每次请求之间等待 1~3 秒
    # wait_time = constant(0)

    @task
    def login_test(self):
        # 构造登录请求
        payload = {
            "email": "eve.holt@reqres.in",
            "password": "cityslicka"
        }
        headers = {
            "Content-Type": "application/json"
        }
        # 发送 POST 请求
        with self.client.post("/api/login", json=payload, headers=headers, catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"登录失败，状态码: {response.status_code}")