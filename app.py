from flask import Flask, render_template
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


if __name__ == '__main__':
    app.run()
