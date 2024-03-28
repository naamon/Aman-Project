from flask import jsonify
from models.member import Member
from models.corona_vaccine import CoronaVaccine
from create_db import db

def add_corona_vaccine_to_member(member_id, vaccine_data):
    try:
        member = Member.query.get_or_404(member_id)
        
        # Check if member already has the maximum allowed number of vaccines
        if len(member.corona_vaccines) >= 4:
            return jsonify({'error': 'Maximum limit of corona vaccines (4) reached for this member'}), 400
        
        new_vaccine = CoronaVaccine(
            date_received=vaccine_data.get('date_received'),
            manufacturer=vaccine_data.get('manufacturer'),
            member_id=member_id
        )
        db.session.add(new_vaccine)
        member.corona_vaccines.append(new_vaccine)  # Add the new vaccine to the member's array
        db.session.commit()
        return jsonify({'message': 'Corona vaccine added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
