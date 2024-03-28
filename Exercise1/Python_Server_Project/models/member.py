from create_db import db
from models.corona_vaccine import CoronaVaccine
from datetime import datetime

class Member(db.Model):
    __tablename__='member'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    social_number = db.Column(db.String, unique=True, nullable=False)  
    date_of_birth = db.Column(db.String(10), nullable=False)  
    phone = db.Column(db.String(20))
    mobile_phone = db.Column(db.String(20))
    city = db.Column(db.String(50))  
    street = db.Column(db.String(50))  
    house_number = db.Column(db.String(20))  
    is_sick = db.Column(db.Boolean)  
    discovery_date = db.Column(db.String(10))  
    date_of_recovery = db.Column(db.String(10))  
    corona_vaccines = db.relationship('CoronaVaccine', backref='member', lazy=True)
    image = db.Column(db.String(100))

    def __repr__(self):
        return f'<Member {self.first_name} {self.last_name}>'
