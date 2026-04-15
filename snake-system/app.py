from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
app = Flask(__name__)
CORS(app) 
@app.route('/add_score', methods=['POST'])
def add_score():
    data = request.get_json()
    score = data.get('score')
    cause = data.get('cause')
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        with open("history.txt", "a") as f:
            f.write(f"[{timestamp}] Score: {score} | Cause: {cause}\n")
        
        return jsonify({"status": "success", "message": "Score saved!"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True, port=5000)
    