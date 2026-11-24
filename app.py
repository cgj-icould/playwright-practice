from flask import Flask, request, jsonify

app = Flask(__name__)

# 模拟数据库中的用户信息
VALID_EMAIL = "eve.holt@reqres.in"
VALID_PASSWORD = "cityslicka"

@app.route('/api/login', methods=['POST'])
def login():
    # 获取请求中的 JSON 数据
    data = request.get_json()
    
    # 如果请求体不是 JSON 或为空
    if not data:
        return jsonify({"error": "Missing request body"}), 400

    email = data.get('email')
    password = data.get('password')

    # 校验账号密码
    if email == VALID_EMAIL and password == VALID_PASSWORD:
        # 登录成功，返回 token
        return jsonify({
            "token": "QpwL5tke4Pnpja7X4",
            "message": "Login successful"
        }), 200
    else:
        # 登录失败
        return jsonify({"error": "Invalid credentials"}), 401

if __name__ == '__main__':
    # 启动服务，端口设为 5000
    app.run(host='127.0.0.1', port=5000, debug=True)