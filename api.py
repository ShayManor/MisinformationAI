import json

from flask import Flask, request
from flask_cors import CORS
from detector import detector

app = Flask('AI Misinformation Detector')
CORS(app)

@app.route("/", methods=['POST'])
def detect():
    print(request.data)
    data = json.dumps(detector().run(str(request.data)))
    return data
