from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.debug = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://Tyler:Pesthlos!2772@localhost:5432/python_todo'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Todo(db.Model):
    __tablename__ = 'todos'
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    description = db.Column(db.String(), nullable=False)

    def __repr__(self):
        return f'<Todo{self.id} {self.description}>'


db.create_all()


@app.route('/')
def index():
    return render_template('index.html', data=Todo.query.all())


@app.route('/todos/create', methods=['POST'])
def create_todo():
    description = request.form.get('description')
    # <-- Equivalent Syntax -->
    # todo = request.form['description']
    todo = Todo(description=description)
    db.session.add(todo)
    db.session.commit()
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run()
