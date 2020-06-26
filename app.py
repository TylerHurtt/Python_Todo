from flask import Flask, render_template

app = Flask(__name__)

app.debug = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://Tyler:Pesthlos!2772@localhost:5432/example'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


@app.route('/')
def index():
    return render_template('index.html', data=({
        'description': 'todo1'
    }, {
        'description': 'todo2'
    }, {
        'description': 'todo3'
    }, {
        'description': 'todo4'
    },))


if __name__ == '__main__':
    app.run()
