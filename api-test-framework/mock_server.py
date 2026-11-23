from flask import Flask, request, jsonify

# 这一行绝对不能漏！没有它，后面的 @app.route 就会报错
app = Flask(__name__)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '')
    password = data.get('password', '')

    # 1. 判空拦截 (返回 400)
    if not email or not password:
        return jsonify({"message": "邮箱或密码不能为空"}), 400
    
    # 2. 邮箱格式拦截 (没有 @ 和 . 的统统返回 400)
    if '@' not in email or '.' not in email:
        return jsonify({"message": "邮箱格式错误"}), 400
        
    # 3. 密码长度拦截 (假设长度小于 6 的返回 400)
    if len(password) < 6:
        return jsonify({"message": "密码太短"}), 400

    # 4. 账号密码业务校验
    if email == 'test@example.com' and len(password) >= 6:
        return jsonify({"message": "登录成功", "token": "fake-token-12345"}), 200
    else:
        return jsonify({"message": "邮箱或密码错误"}), 401

if __name__ == '__main__':
    app.run(port=5000)