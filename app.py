from flask import Flask, render_template
import pandas as pd


app = Flask(__name__, static_folder='static', template_folder='templates')


@app.route('/', methods = ["GET"])
def index():
	# with open("./static/resume.txt", encoding="utf-8") as t:
	# 	txt = t.read()
	# 	t.close()

	with open("./static/images/o.svg", "r") as i:
		svg = i.read()
		i.close()

	letters = {
	"t":{"img":"t.png", "count":20}, 
	"o":{"img":"o.png", "count":100}, 
	"m":{"img":"m.png", "count":10}, 
	"e":{"img":"e.png", "count":100},
	"q":{"img":"q.png", "count":2}
	}

	return render_template('index.html', svg = svg, letters = letters)

if __name__ == '__main__':
    app.run(debug=True)