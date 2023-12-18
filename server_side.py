from flask import Flask, request
from datetime import datetime, timedelta
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# This will store the valid time list
time_list = ["2023-12-20", "2023-12-21", "2023-12-22"]


def is_valid_datetime(dt_string):
    try:
        datetime.strptime(dt_string, "%Y-%m-%d %H:%M:%S")
        return True
    except ValueError:
        return False


@app.route("/", methods=["GET", "POST"])
def index():
    global time_list
    if request.method == "POST":
        # Parse the input data
        input_data = request.form["time_data"]
        # Filter out invalid and empty lines
        time_list = [
            line.strip()
            for line in input_data.split("\n")
            if line.strip() and is_valid_datetime(line.strip())
        ]
    time_list_text = "\n".join(time_list)
    return (
        """
        <head>
        <!DOCTYPE html>
        <html lang="en">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Time Data</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    text-align: center;
                    padding: 20px;
                }

                h1, h2 {
                    color: #333;
                }

                form {
                    margin: 20px auto;
                    width: 70%;
                }

                textarea {
                    width: 100%;
                    font-size: 1.2em;
                    padding: 10px;
                    max-width: 300px;
                    margin-top: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box;
                    resize: vertical;
                    margin: 10px auto;
                }

                input[type=submit] {
                    width: 100%;
                    padding: 10px;
                    margin-top: 10px;
                    max-width: 300px;
                    background-color: #5cb85c;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                input[type=submit]:hover {
                    background-color: #4cae4c;
                }

                ul {
                    list-style-type: none;
                    padding: 0;
                    max-width: 300px;
                    margin: 0px auto;
                }

                li {
                    background-color: #eee;
                    margin-top: 5px;
                    padding: 10px;
                    border-radius: 4px;
                }

                button {
                    padding: 10px 15px;
                    background-color: #337ab7;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 20px;
                }

                button:hover {
                    background-color: #286090;
                }
            </style>
        </head>
        <body>
        
        <h1>子悦的独门秘笈</h1>
        <h2>∑(っ°Д°;)っ</h2>
        <form method="post">
            <div>
            <textarea name="time_data" id="inputArea" rows="4"></textarea>
            </div>
            <input type="submit">
        </form>
        <h3>已经储存的时间表:</h3>
        <ul>
        """
        + "".join(f"<li>{time}</li>" for time in time_list)
        + """
        </ul>
        <textarea id="timeListText" style="display:none;">{}</textarea>
        <button onclick="copyToInputArea()">添加或修改</button>
        <script>
        function copyToInputArea() {{
            var content = document.getElementById("timeListText").value;
            document.getElementById("inputArea").value = content;
        }}
        </script>

        </body>
</html>
        """.format(
            time_list_text
        )
    )


@app.route("/times")
def times():
    # Filter out invalid datetime strings and calculate 3 days later
    current_date = datetime.now().date()

    valid_time_list = [time for time in time_list if is_valid_datetime(time)]

    three_days_later_list = [
        time
        for time in valid_time_list
        if (datetime.strptime(time, "%Y-%m-%d %H:%M:%S").date() - current_date).days
        == 3
    ]

    return "\n".join(three_days_later_list)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
