 from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow requests from your JS frontend


@app.route('/score', methods=['POST'])
def save_score():
    data = request.json

    # Extract values sent from JS
    player = data.get("player", "Anonymous")
    score = data.get("score", 0)
    cause = data.get("cause", "UNKNOWN")
    time = data.get("time", "")

    # Format the line to store
    line = f"{time} | {player} | Score: {score} | Cause: {cause}\n"

    # Write into history.txt (append mode)
    with open("history.txt", "a") as file:
        file.write(line)

    return jsonify({"status": "success", "message": "Score saved"})


if __name__ == "__main__":
    app.run(debug=True)