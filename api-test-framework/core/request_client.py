# core/request_client.py
import requests
from config import BASE_URL
from logger import logger
class RequestClient:
    def __init__(self):
        # 保持一个 session，自动管理 Cookie
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})

    def send_request(self, method, endpoint, **kwargs):
        # 拼接完整的 URL
        url = f"{BASE_URL}{endpoint}"
        logger.info(f"发送请求：{method.upper()} {url}")
        if kwargs.get("json"):
            logger.info(f"请求参数：{kwargs['json']}")
        
        # 发送请求
        response = self.session.request(method, url, **kwargs)
        
        # 打印日志（真实企业框架里这里会写进 Log 文件）
        logger.info(f"响应状态码:{response.status_code}")
        logger.info(f"响应内容:{response.text}")
        return response