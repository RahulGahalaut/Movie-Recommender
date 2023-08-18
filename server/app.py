from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token
from dotenv import load_dotenv
from flask_cors import CORS
import bcrypt
import os
import requests
import datetime
import binascii


load_dotenv()
app = Flask(__name__)
CORS(app)
# Configure SQLAlchemy and JWTManager
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['SQLALCHEMY_DATABASE_URI']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ['JWT_SECRET_KEY']
db = SQLAlchemy(app)
jwt = JWTManager(app)


# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.LargeBinary, nullable=False)
    interests = db.Column(db.JSON)


TMDB_HEADERS = {
    "accept": "application/json",
    "Authorization": "Bearer {}".format(os.environ['TMDB_AUTHORIZATION_TOKEN'])
}


# Register route
@app.route('/users/register', methods=['POST'])
def register():
    try:
        data = request.json
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"message": "User already exists"}), 409

        hashed_password = bcrypt.hashpw(
            data['password'].encode('utf-8'), bcrypt.gensalt())
        new_user = User(name=data['name'], email=data['email'],
                        password=hashed_password, interests=data['interests'])
        db.session.add(new_user)
        db.session.commit()
        expires = datetime.timedelta(days=30)
        access_token = create_access_token(
            identity=new_user.id, expires_delta=expires)
        return jsonify({"token": access_token}), 201
    except Exception as e:
        print(e)
        return jsonify({"message": "Internal server error"}), 500


# Login route
@app.route('/users/login', methods=['POST'])
def login():
    try:
        data = request.json
        user = User.query.filter_by(email=data['email']).first()
        if user and bcrypt.checkpw(data['password'].encode('utf-8'), user.password):
            expires = datetime.timedelta(days=30)
            access_token = create_access_token(
                identity=user.id, expires_delta=expires)
            return jsonify({"token": access_token}), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        print(e)
        return jsonify({"message": "Internal server error"}), 500


@app.route('/movies/genres', methods=['GET'])
def get_genres():
    try:
        url = "https://api.themoviedb.org/3/genre/movie/list?language=en"
        response = requests.get(url, headers=TMDB_HEADERS)
        return jsonify(response.json()), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Internal server error"}), 500


# Protected route
@app.route('/movies/search', methods=['GET'])
@jwt_required()
def search_movie():
    try:
        movie_name = request.args.get('movie_name')
        page = request.args.get('page')
        url = "https://api.themoviedb.org/3/search/movie?query={}&include_adult=false&language=en-US&page={}".format(
            movie_name, page)
        response = requests.get(url, headers=TMDB_HEADERS)
        return jsonify(response.json()), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Internal server error"}), 500


@app.route('/movies/recommended', methods=['GET'])
@jwt_required()
def recommend_movies():
    try:
        page = request.args.get('page')
        movie_id = request.args.get('movie_id')
        url = "https://api.themoviedb.org/3/movie/{}/similar?language=en-US&page={}".format(
            movie_id, page)
        response = requests.get(url, headers=TMDB_HEADERS)
        return jsonify(response.json()), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Internal server error"}), 500


@app.route('/movies/info', methods=['GET'])
@jwt_required()
def movie_info():
    try:
        movie_id = request.args.get('movie_id')
        url = "https://api.themoviedb.org/3/movie/{}?language=en-US".format(
            movie_id)
        response = requests.get(url, headers=TMDB_HEADERS)
        return jsonify(response.json()), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Internal server error"}), 500


@app.route('/movies/interested', methods=['GET'])
@jwt_required()
def interested_movies():
    try:
        page = request.args.get('page')
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        genres = '|'.join(user.interests)
        url = url = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page={}&sort_by=popularity.desc&with_genres={}".format(page,
                                                                                                                                                                               genres)
        response = requests.get(url, headers=TMDB_HEADERS)
        return jsonify(response.json()), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Internal server error"}), 500


with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(port=os.environ['PORT'], debug=True)
