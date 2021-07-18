import flask
from flask import request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import keras
from keras.models import load_model
from sklearn.preprocessing import StandardScaler

app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

model = load_model('model\model.h5')

@app.route('/api/v1/forecast/', methods=['GET'])
def api_data():
    input = []
    for i in range(1,7):
        input.append([float(request.args.get(f'input{i}'))])
    scaler = StandardScaler()
    input_scaled = scaler.fit_transform(input)
    input_scaled = tf.stack([np.array(input_scaled)])
    input_scaled.set_shape([None, 6, 1])
    results = model.predict(input_scaled, verbose=0)
    scaled_results = scaler.inverse_transform([results])
    scaled_results = np.squeeze(scaled_results)
    scaled_results = scaled_results.tolist()
    return jsonify(scaled_results)

app.run()