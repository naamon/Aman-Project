from flask import Flask,jsonify,request
from flask_cors import CORS
from create_db import db
from models.member import Member
from models.corona_vaccine import CoronaVaccine
from controllers.member_controller import (
    get_all_members,
    get_member_by_id,
    create_member,
    update_member,
    delete_member,
)
from controllers.corona_vaccines_controller import add_corona_vaccine_to_member  
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///HMO8.db'
db.init_app(app)

# Routes for member 
@app.route('/members', methods=['GET'])
def get_members_route():
    return get_all_members()

@app.route('/members', methods=['POST'])
def create_member_route():
    return create_member()

@app.route('/members/<int:member_id>', methods=['PUT', 'PATCH'])
def update_member_route(member_id):
    return update_member(member_id)

@app.route('/members/<int:member_id>', methods=['DELETE'])
def delete_member_route(member_id):
    return delete_member(member_id)

@app.route('/members/<int:member_id>', methods=['GET'])
def get_member_by_id_route(member_id):
    return get_member_by_id(member_id)

# Add route for adding a corona vaccine to a member
@app.route('/members/<int:member_id>/corona_vaccines', methods=['POST'])
def add_corona_vaccine_to_member_route(member_id):
    try:
        data = request.get_json()
        return add_corona_vaccine_to_member(member_id, data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)


