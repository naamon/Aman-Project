from create_db import db

class CoronaVaccine(db.Model):
    __tablename__ = 'corona_vaccine'
    id = db.Column(db.Integer, primary_key=True)
    date_received = db.Column(db.String(10), nullable=False)  
    manufacturer = db.Column(db.String(50), nullable=False)
    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)

    def __repr__(self):
        return f'<CoronaVaccine {self.manufacturer}>'