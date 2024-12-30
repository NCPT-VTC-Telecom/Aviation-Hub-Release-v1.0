from flask import Flask, jsonify, request
from gevent.pywsgi import WSGIServer
import json

app = Flask(__name__)

# Tạo một danh sách đối tượng (mock data)
todos = [
    {'id': 1, 'title': 'Buy groceries', 'completed': False},
    {'id': 2, 'title': 'Learn Python', 'completed': False}
]

# API endpoint để lấy danh sách tất cả các công việc
@app.route('/', methods=['GET'])
def get_todos():
    return jsonify(todos)

# API endpoint để lấy một công việc cụ thể
@app.route('/todos/<int:todo_id>', methods=['GET'])
def get_todo_by_id(todo_id):
    todo = [todo for todo in todos if todo['id'] == todo_id]
    if len(todo) == 0:
        return jsonify({'error': 'Todo not found'})
    return jsonify(todo[0])

# API endpoint để tạo một công việc mới
@app.route('/todos', methods=['POST'])
def create_todo():
    new_todo = {
        'id': todos[-1]['id'] + 1,
        'title': request.json['title'],
        'completed': False
    }
    todos.append(new_todo)
    return jsonify(new_todo), 201, 1

# API endpoint để cập nhật một công việc
@app.route('/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    todo = [todo for todo in todos if todo['id'] == todo_id]
    if len(todo) == 0:
        return jsonify({'error': 'Todo not found'})
    todo[0]['title'] = request.json.get('title', todo[0]['title'])
    todo[0]['completed'] = request.json.get('completed', todo[0]['completed'])
    return jsonify(todo[0])

# API endpoint để xóa một công việc
@app.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    todo = [todo for todo in todos if todo['id'] == todo_id]
    if len(todo) == 0:
        return jsonify({'error': 'Todo not found'})
    todos.remove(todo[0])
    return jsonify({'result': True})

@app.route('/danh-sach-project', methods=['GET'])
def getDSProject():
    data = [{'ProjectName': 'Thêm nhãn', "type":2,"data":[['Câu 1','Câu 2'],['Câu 1','Câu 2'],['Câu 1','Câu 2']],"employees":['1','9','12','23'],"limitEmp":'30',"status":0, "time":'',"last_time":""}]
    json_data = json.dumps({'result': 1, 'message':'Thành công','data': data }, ensure_ascii=False).encode('utf-8')

    response = app.response_class(
        response=json_data,
        status=200,
        mimetype='application/json'
    )
    return response
@app.route('/login', methods=['POST'])
def login():
    raw_data = request.get_data()  # Lấy dữ liệu raw từ yêu cầu
    user = json.loads(raw_data)
    # print(user)
    real_un = ""
    real_pw=""
    
    if real_un == user['username'] and real_pw==user['password']:
        json_data = json.dumps({'result': 1, 'message':'Thành công','data': {'username':user['username'],'password':user['password']} }, ensure_ascii=False).encode('utf-8')
        response = app.response_class(
            response=json_data,
            status=200,
            mimetype='application/json'
        )
    else:
        json_data = json.dumps({'result': 0, 'message':'Sai tên tài khoản hoặc mật khẩu','data': {'username':user['username'],'password':user['password']} }, ensure_ascii=False).encode('utf-8')
        response = app.response_class(
            response=json_data,
            status=400,
            mimetype='application/json'
        )
    return response


if __name__ == '__main__':
    http_server = WSGIServer(('127.0.0.1', 5000), app)
    http_server.serve_forever()
