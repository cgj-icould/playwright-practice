import os
os.environ['HTTP_PROXY'] = ''
os.environ['HTTPS_PROXY'] = ''

import httpx
from openai import OpenAI

import os
# 从系统环境变量读取，没有则显示"未配置"
API_KEY = os.getenv("DASHSCOPE_API_KEY", "你的Key未配置") 
BASE_URL = os.getenv("DASHSCOPE_BASE_URL", "https://ws-31v8.../v1") # 这里换成你的专属地址

http_client = httpx.Client(proxy=None, http2=False)
client = OpenAI(api_key=API_KEY, base_url=BASE_URL, http_client=http_client)

def analyze_error(log_content):
    print("🤖 AI 正在思考报错原因，请稍候...\n")
    
    prompt = f"请分析以下测试报错：\n{log_content}"

    # ✅ 注意这里，model 字段在这里！
    response = client.chat.completions.create(
        model="qwen-plus", 
        messages=[
            {"role": "system", "content": "你是一个专业的软件测试专家。"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )
    
    print("================ AI 诊断报告 ================")
    print(response.choices[0].message.content)
    print("=============================================")

import subprocess
import os
import xmltodict
# 注意：确保文件最上面 import 了 httpx 和 OpenAI 等，这部分不要删

if __name__ == "__main__":
    print("🔄 正在自动执行 Pytest 测试用例...")
    
    # 1. 自动在后台运行 pytest，并生成一个名为 report.xml 的报告文件
    # （这里故意用 -v，让生成的报告包含详细步骤）
    result = subprocess.run(
        ["python", "-m", "pytest", "tests/test_user.py", "--junitxml=report.xml"],
        capture_output=True,
        text=True
    )
    
    print("✅ 测试执行完毕！正在解析测试结果...")
    
    # 2. 检查是否生成了报告文件
    if os.path.exists("report.xml"):
        with open("report.xml", "r", encoding="utf-8") as f:
            report_data = xmltodict.parse(f.read())
        
        # 3. 提取真实报错信息
        try:
            # 适配 pytest 生成的 XML 结构
            testsuites = report_data.get('testsuites', {})
            testsuite = testsuites.get('testsuite', [])
            
            # 如果只有一个测试套件，pytest 会返回字典；如果有多个，返回列表
            if isinstance(testsuite, dict):
                testsuite = [testsuite]
                
            real_error_log = ""
            
            for suite in testsuite:
                testcases = suite.get('testcase', [])
                if isinstance(testcases, dict):
                    testcases = [testcases]
                    
                for case in testcases:
                    # 如果这个用例里面有 failure 标签，说明它挂了
                    if 'failure' in case:
                        case_name = case.get('@name', '未知用例')
                        error_msg = case['failure'].get('#text', '无详细报错')
                        real_error_log += f"\n【失败用例】: {case_name}\n【报错详情】:\n{error_msg}\n"
            
            # 4. 判断并呼叫 AI
            if real_error_log:
                print("🚨 抓到真实报错了！正在呼叫 AI 专家进行诊断...")
                analyze_error(real_error_log)  # 调用你上面写好的 AI 函数
            else:
                print("🎉 太棒了！所有测试用例 100% 全部通过，没有发现任何报错！")
                
        except Exception as e:
            print(f"解析报告时发生异常: {e}")
    else:
        print("❌ 未找到 report.xml 文件，可能是 pytest 执行失败。")