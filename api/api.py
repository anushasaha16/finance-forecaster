import flask
from flask import request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import keras
from keras.models import load_model

app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

CONV_WIDTH = 3
model = load_model('model\model.h5')

@app.route('/api/v1/forecast/', methods=['GET'])
def api_data():
    input = []
    for i in range(1,7):
        input.append([float(request.args.get(f'input{i}'))])
    input = tf.stack([np.array(input)])
    input.set_shape([None, 6, 1])
    results = model.predict(input, verbose=0)
    results = np.squeeze(results)
    results = results.tolist()
    return jsonify(results)

app.run()