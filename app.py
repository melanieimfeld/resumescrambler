from flask import Flask, render_template
import pandas as pd


app = Flask(__name__, static_folder='static', template_folder='templates')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

def readDoc(name):
	letters = {}
	t = open(name, encoding="utf-8")
	try:
		for line in t:
			for char in line.lower().lstrip().replace("\n","").replace(" ",""):
				if char in letters.keys():
					letters[char] = letters[char] + 1
				else:
					letters[char] = 1
			#print(t.read().lower())
	except UnicodeDecodeError:
		print("wrong decoding")
	finally:
		#pass
		t.close()
		return letters


@app.route('/', methods = ["GET"])
def index():
	
	txt = readDoc("static/resume.txt")

	print(txt)

	with open("./static/images/o.svg", "r") as i:
		svg = i.read()
		i.close()

	letters = {
	"t":{"img":"t.png", "count":100}, 
	"o":{"img":"o.png", "count":100}, 
	"m":{"img":"m.png", "count":200}, 
	"e":{"img":"e.png", "count":200},
	"q":{"img":"q.png", "count":2}
	}

	return render_template('index.html', svg = svg, letters = letters)

if __name__ == '__main__':
    app.run(debug=True)