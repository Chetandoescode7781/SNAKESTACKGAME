from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
import os
app = Flask(__name__)
CORS(app)   # allows all origins by default (for dev)


HISTORY_FILE = 'history.txt'

# Serve index.html (optional: if you want Flask to serve the frontend)
@app.route('/')
def index_page():
    return send_from_directory('static', 'index.html')

# API endpoint to save score (only one route for POST)
@app.route('/save_score', methods=['POST'])
def save_score():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'status': 'error', 'message': 'Invalid or missing JSON'}), 400

    required_fields = ['name', 'score', 'cause', 'duration']
    for field in required_fields:
        if field not in data:
            return jsonify({'status': 'error', 'message': f'Missing field: {field}'}), 400

    try:
        name = str(data['name']).strip()
        score = int(data['score'])
        cause = str(data['cause']).upper()
        duration = int(data['duration'])
    except (ValueError, TypeError):
        return jsonify({'status': 'error', 'message': 'Invalid field types'}), 400

    if not name:
        return jsonify({'status': 'error', 'message': 'Name is empty'}), 400
    if score < 0:
        return jsonify({'status': 'error', 'message': 'Invalid score'}), 400
    if duration < 0:
        return jsonify({'status': 'error', 'message': 'Invalid duration'}), 400

    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    line = f"[{timestamp}] {name} | {score} | {cause} | {duration}\n"
     
    if not os.path.exists("history.txt"):
    # Create the file with a header line
     with open("history.txt", "w") as f:
        f.write(line)
     return jsonify({'status': 'ok', 'message': 'Score saved'}), 200
    # Ensure history file exists and append
    with open(HISTORY_FILE, 'a', encoding='utf-8') as f:
        f.write(line)
    return jsonify({'status': 'ok', 'message': 'Score saved'}), 200

 # API endpoint to get highscore for a given username
@app.route('/get_highscore', methods=['GET'])
def get_highscore():
    username = request.args.get('name', '').strip()
    if not username:
        return jsonify({'status': 'error', 'message': 'Missing username'}), 400

    highscore = 0
    try:
        with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                if username in line:
                    parts = line.strip().split('|')
                    if len(parts) >= 3:
                        score = int(parts[1].strip())
                        if score > highscore:
                            highscore = score
    except FileNotFoundError:
        return jsonify({'status': 'error', 'message': 'History file not found'}), 404

    return jsonify({'status': 'ok', 'name': username, 'highscore': highscore}), 200

if __name__ == '__main__':
    # Run on port 5000 to avoid conflict with static dev servers (5500)
    app.run(host='127.0.0.1', port=5000, debug=True)

   