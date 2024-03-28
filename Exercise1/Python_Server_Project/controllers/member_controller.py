from flask import jsonify, request
from models.member import Member
from create_db import db
from sqlalchemy.orm import joinedload  # Add this import statement


def create_member():
    try:
        data = request.get_json()
        
        # Check if required fields are provided
        required_fields = ['first_name', 'last_name', 'date_of_birth', 'phone', 'mobile_phone', 'is_sick', 'social_number', 'city', 'street', 'house_number']  # Added new fields here
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate social number
        social_number = data.get('social_number')
        if not social_number or not (isinstance(social_number, str) and len(social_number) == 9):
            return jsonify({'error': 'Social number must be a 9-character string'}), 400

        # Check social number uniqueness
        if Member.query.filter_by(social_number=social_number).first():
            return jsonify({'error': 'Social number already exists for another member'}), 400
        
        # Check is_sick attribute and date of discovery
        is_sick = data.get('is_sick', False)
        discovery_date = data.get('discovery_date')
        if is_sick and not discovery_date:
            return jsonify({'error': 'Date of discovery is required for sick members'}), 400
        
        # Check date of recovery if provided
        date_of_recovery = data.get('date_of_recovery')
        if date_of_recovery and discovery_date and date_of_recovery <= discovery_date:
            return jsonify({'error': 'Date of recovery must be after the date of discovery'}), 400
        
        # Create a new member with the provided data 
        new_member = Member(
            first_name=data['first_name'],
            last_name=data['last_name'],
            date_of_birth=data['date_of_birth'],
            phone=data['phone'],
            social_number=data['social_number'],
            mobile_phone=data['mobile_phone'],
            city=data['city'],  # Added new fields here
            street=data['street'],  # Added new fields here
            house_number=data['house_number'],  # Added new fields here
            corona_vaccines=[],  
            date_of_recovery=date_of_recovery,
            image=None,  
            discovery_date=discovery_date,
            is_sick=is_sick,
        )
        
        # Add and commit the new member to the database
        db.session.add(new_member)
        db.session.commit()
        
        return jsonify({'message': 'Member created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def update_member(member_id):
    try:
        member = Member.query.get_or_404(member_id)
        data = request.get_json()
        
        # Check if required fields are provided
        required_fields = ['first_name', 'last_name', 'date_of_birth', 'phone', 'mobile_phone', 'is_sick', 'social_number', 'city', 'street', 'house_number']  # Added new fields here
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
            
        # Validate social number
        social_number = data.get('social_number')
        if not social_number or not (isinstance(social_number, str) and len(social_number) == 9):
            return jsonify({'error': 'Social number must be a 9-character string'}), 400

        # Check social number uniqueness if provided
        if social_number != member.social_number and Member.query.filter_by(social_number=social_number).first():
            return jsonify({'error': 'Social number already exists for another member'}), 400
        
        # Check is_sick attribute and date of discovery
        is_sick = data.get('is_sick', member.is_sick)
        discovery_date = data.get('discovery_date', member.discovery_date)
        if is_sick and not discovery_date:
            return jsonify({'error': 'Date of discovery is required for sick members'}), 400
        
        # Check date of recovery if provided
        date_of_recovery = data.get('date_of_recovery', member.date_of_recovery)
        if date_of_recovery and discovery_date and date_of_recovery <= discovery_date:
            return jsonify({'error': 'Date of recovery must be after the date of discovery'}), 400
        
        # Update member fields
        member.first_name = data.get('first_name', member.first_name)
        member.last_name = data.get('last_name', member.last_name)
        member.date_of_birth = data.get('date_of_birth', member.date_of_birth)
        member.social_number = data.get('social_number',member.social_number)
        member.phone = data.get('phone', member.phone)
        member.mobile_phone = data.get('mobile_phone', member.mobile_phone)
        member.city = data.get('city', member.city)  # Added new fields here
        member.street = data.get('street', member.street)  # Added new fields here
        member.house_number = data.get('house_number', member.house_number)  # Added new fields here
        member.date_of_recovery = date_of_recovery
        member.image = data.get('image', member.image)
        member.discovery_date = discovery_date
        member.is_sick = is_sick
        
        db.session.commit()

        return jsonify({'message': 'Member updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def delete_member(member_id):
    try:
        member = Member.query.get_or_404(member_id)
        
        # Delete related corona_vaccines
        for vaccine in member.corona_vaccines:
            db.session.delete(vaccine)
        
        db.session.delete(member)
        db.session.commit()
        return jsonify({'message': 'Member and related vaccines deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def get_all_members():
    try:
        members = Member.query.all()
        member_list = []
        for member in members:
            member_data = {
                'id': member.id,
                'first_name': member.first_name,
                'last_name': member.last_name,
                'date_of_birth': member.date_of_birth,
                'social_number': member.social_number,
                'phone': member.phone,
                'mobile_phone': member.mobile_phone,
                'date_of_recovery': member.date_of_recovery,
                'image': member.image,
                'discovery_date': member.discovery_date,
                'is_sick': member.is_sick,
                'city': member.city,
                'street': member.street,
                'house_number': member.house_number,
                'corona_vaccines': [{'id': vaccine.id, 'date_received': vaccine.date_received, 'manufacturer': vaccine.manufacturer} for vaccine in member.corona_vaccines]
            }
            member_list.append(member_data)
        return jsonify({'members': member_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_member_by_id(member_id):
    try:
        member = Member.query.options(joinedload(Member.corona_vaccines)).get_or_404(member_id)
        
        # Serialize corona_vaccines manually
        vaccines_list = []
        for vaccine in member.corona_vaccines:
            vaccine_data = {
                'id': vaccine.id,
                'date_received': vaccine.date_received,
                'manufacturer': vaccine.manufacturer
                # Add more fields if needed
            }
            vaccines_list.append(vaccine_data)
        
        member_data = {
            'id': member.id,
            'first_name': member.first_name,
            'last_name': member.last_name,
            'date_of_birth': member.date_of_birth,
            'social_number': member.social_number,
            'phone': member.phone,
            'mobile_phone': member.mobile_phone,
            'date_of_recovery': member.date_of_recovery,
            'image': member.image,
            'discovery_date': member.discovery_date,
            'is_sick': member.is_sick,
            'city': member.city,
            'street': member.street,
            'house_number': member.house_number,
            'corona_vaccines': vaccines_list  # Use the serialized list here
        }
        return jsonify({'member': member_data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
