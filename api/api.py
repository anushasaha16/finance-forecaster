import flask
from flask import request, jsonify
import numpy as np
import tensorflow as tf
import keras
from keras.models import load_model

app = flask.Flask(__name__)
app.config["DEBUG"] = True

CONV_WIDTH = 3
model = load_model('model\model.h5')

@app.route('/api/v1/forecast/', methods=['GET'])
def api_data():
    input = request.args.get("input")
    input = tf.stack([np.array(input)])
    input.set_shape([None, 6, 1])
    print(input)
    results = model.predict(input, verbose=0)
    return jsonify(results)

app.run()