from flask import Flask,render_template,jsonify,request
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_pymongo import PyMongo
from flask_cors import CORS
import requests

app = Flask(__name__)

CORS(app)

uri = "mongodb+srv://saleemmalik:saleemmalik@movietheaterdatabase.8yvmxev.mongodb.net/?retryWrites=true&w=majority&appName=MovieTheaterDatabase"
#mongodb+srv://mohammed20221656:gKaGbyaGQUCScaRT@database.bs0vwhu.mongodb.net/?retryWrites=true&w=majority&appName=Database
app.config['MONGO_URI'] = uri
db = PyMongo(app)
client = MongoClient(uri)


@app.route("/")
def home():
    return jsonify({"data":"Ok"})  


@app.route('/createuser', methods=['POST'])
def create_user():
    try:
        user_data = request.json
        if 'name' not in user_data or 'email' not in user_data:
            return jsonify({'message': 'Name and email are required'}), 400
        
        if client.movietheaterdatabase.users.find_one({'email': user_data['email']}):
            return jsonify({'message': 'Email is already available'}), 400
        
        client.movietheaterdatabase.users.insert_one({
            'name': user_data['name'],
            'email': user_data['email']
            
        })
        
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error creating user'}), 500


@app.route('/getform', methods=['GET'])
def get_form():
    try:
        form_data = request.args.to_dict(flat=False)
        print(form_data)
        
        theatreName = request.args.get('theatreName')
        location = request.args.get('location')
        movieName = request.args.get('movieName')
        date = request.args.get('date')
        time = request.args.get('time')
        seatCategory= request.args.get('seatCategory')
        seatNumber= request.args.get('seatNumber')
        price = request.args.get('price')
        client.movietheaterdatabase.booking.insert_one({
            'theatreName': theatreName,
            'location': location,
            "date" : date,
            "time" : time,
            "seatcategory" : seatCategory,
            "seatNumber" : seatNumber,
            "price" : price    
        })

        print(f"Theatre Name: {theatreName}")
        print("HIII")
        response="Booked successfully"
        
        return jsonify(response)
    except Exception as e:
        print(e)
        return jsonify({"message": "Error processing form"}), 500



@app.route('/getmovie', methods=['GET'])
def get_movie():
    try:
        # movie_data = request.json
        movie_data = request.args.get('movie')
        print(movie_data)
        # if movie_data == "":
        #     return jsonify({'message': 'Movie Name required'}), 400
        # movie_name = movie_data
        print("OK")
        request_url = f"http://www.omdbapi.com/?apikey=b07afa19&s={movie_data}"
        response = requests.get(request_url)
        movie_info = response.json()
        return jsonify(movie_info), 200

    
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error getting movie'}), 500

@app.route('/getmoviebyyear', methods=['GET'])
def get_movie_by_year():
    try:
        print("A")
        # movie_data = request.json
        movie_data = request.args.get('year')
        print(movie_data)
        # if movie_data == "":
        #     return jsonify({'message': 'Movie Name required'}), 400
        # movie_name = movie_data
        request_url = f"http://www.omdbapi.com/?apikey=b07afa19&y={movie_data}"
        response = requests.get(request_url)
        movie_info = response.json()
        print(movie_info)
        return jsonify(movie_info), 200

    
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error getting movie'}), 500


@app.route('/getmovie/<id>', methods=['GET'])
def get_movie_by_id(id):
    try:
        if not id:
            return jsonify({'message': 'Movie ID required'}), 400
        
        request_url = f"http://www.omdbapi.com/?apikey=b07afa19&i={id}"
        response = requests.get(request_url)
        movie_info = response.json()
        
        if response.status_code != 200 or movie_info.get('Response') == 'False':
            return jsonify({'message': 'Movie not found'}), 404
        
        return jsonify(movie_info), 200
    
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error getting movie'}), 500


        
if __name__ == "__main__":
    try:
        app.run(debug=False)
    except Exception as e:
        print(e)



