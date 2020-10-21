from flask import Flask, render_template
import pandas as pd
from PIL import Image, ImageShow, ImageDraw, ImageFont
import re
import os.path


app = Flask(__name__, static_folder='static', template_folder='templates')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
PATH = "static/images/"
DOCNAME = "static/resume_short.txt"

def readDoc(name):
	letters = {}
	t = open(name, encoding="utf-8")
	try:
		for line in t:
			x = re.sub(r'[\W\s]', "", line).lower()
			print("line", x)
			for char in x:
				if char in letters.keys():
					letters[char]["count"] = letters[char]["count"] + 1
				else:
					letters[char] = {"count" : 1, "img": f"{PATH}{char}.png"}
			#print(t.read().lower())
	except UnicodeDecodeError:
		print("wrong decoding")
	finally:
		#pass
		t.close()
		return letters

def stringToImage(letterlist):
	fontsize= 30
	font = ImageFont.truetype("static/LEMONMILK-Regular.ttf", fontsize)

	for char in letterlist.keys():
		#print(l)
		if not os.path.isfile(f"{PATH}{char}.png"):
			print("file does note exist")
			letter = Image.new("RGBA", (25, 25),(0, 0, 0, 0))
			d = ImageDraw.Draw(letter)
			d.text((1,-8), char , font=font, fill=(255,255,255), anchor = "ms")
			letter.save(f"{PATH}{char}.png", "png")

@app.route('/', methods = ["GET"])
def index():
	
	letters = readDoc(DOCNAME)
	stringToImage(letters)


	return render_template('index.html', letters = letters)

if __name__ == '__main__':
    app.run(debug=True)
