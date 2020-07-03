from flask import Flask, render_template, request, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, MigrateCommand
import sys

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://Tyler:Pesthlos!2772@localhost:5432/python_todo'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.debug = True

db = SQLAlchemy(app)

migrate = Migrate(app, db)


class TodoList(db.Model):
    # Parent model
    __tablename__ = 'todolists'
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    name = db.Column(db.String(), nullable=False)
    todos = db.relationship('Todo', backref='list')

    def __repr__(self):
        return f'<List{self.id} {self.name}>'


class Todo(db.Model):
    # Child model
    __tablename__ = 'todos'
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    description = db.Column(db.String(), nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)
    list_id = db.Column(db.Integer, db.ForeignKey(
        'todolists.id'), nullable=False)

    def __repr__(self):
        return f'<Todo{self.id} {self.description}>'


@app.route('/')
def index():
    return redirect(url_for('get_list', list_id=TodoList.query.first().id))


# Todolist Routes
@app.route('/todolist/<list_id>')
def get_list(list_id):
    return render_template('index.html', lists=TodoList.query.order_by('id').all(), todos=Todo.query.filter(Todo.list_id == list_id).order_by('id').all(), selected=TodoList.query.get(list_id))


@app.route('/todolist/create', methods=['POST'])
def create_todolist():
    error = False
    body = {}
    try:
        name = request.get_json()['name']
        print('name ==>', name)
        todolist = TodoList(name=name)
        db.session.add(todolist)
        db.session.commit()
        body = {
            'id': todolist.id,
            'name': todolist.name
        }
    except:
        db.session.rollback()
        error = True
        print(sys.exc_info())
    finally:
        db.session.close()
    if error:
        abort(400)
    else:
        return jsonify(body)


@app.route('/todolist/<list_id>/rename', methods=['PATCH'])
def rename_todolist(list_id):
    print('id', list_id)
    body = {}
    try:
        new_name = request.get_json()['newName']
        print('<-----new_name----->', new_name)
        todolist = TodoList.query.get(list_id)
        print('before', todolist.name)
        todolist.name = new_name
        print('after', todolist.name)
        body = {
            'name': todolist.name
        }
        db.session.commit()
    except:
        db.session.rollback()
        print(sys.exc_info())
    finally:
        db.session.close()
    return jsonify(body)


@app.route('/todolist/<list_id>/delete', methods=['DELETE'])
def delete_todolist(list_id):
    try:
        todolist = TodoList.query.get(list_id)
        todos = Todo.query.filter(Todo.list_id == list_id).all()
        for todo in todos:
            db.session.delete(todo)
        db.session.delete(todolist)
        print('deleted', todolist)
        db.session.commit()
    except:
        db.session.rollback()
        print(sys.exc_info())
    finally:
        db.session.close()
    return redirect(url_for('index'))

# Todos Routes


@app.route('/todos/create', methods=['POST'])
def create_todo():
    error = False
    body = {}
    try:
        description = request.get_json()['description']
        list_id = request.get_json()['listId']
        todo = Todo(description=description, list_id=list_id)
        db.session.add(todo)
        db.session.commit()
        body = {
            'id': todo.id,
            'description': todo.description,
            'list_id': todo.list_id
        }
    except:
        db.session.rollback()
        error = True
        print(sys.exc_info())
    finally:
        db.session.close()
    if error:
        abort(400)
    else:
        return jsonify(body)


@app.route('/todos/<todo_id>/set-completed', methods=['POST'])
def set_completed(todo_id):
    try:
        is_completed = request.get_json()['completed']
        todo = Todo.query.get(todo_id)
        print('before', todo.completed)
        todo.completed = is_completed
        print('after', todo.completed)
        db.session.commit()
    except:
        db.session.rollback()
        print(sys.exc_info())
    finally:
        db.session.close()
    return redirect(url_for('index'))


@app.route('/todos/<todo_id>/delete', methods=['DELETE'])
def delete_todo(todo_id):
    try:
        todo = Todo.query.get(todo_id)
        db.session.delete(todo)
        print('deleted', todo)
        db.session.commit()
    except:
        db.session.rollback()
        print(sys.exc_info())
    finally:
        db.session.close()
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run()
