import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { Member } from '../models/member';
import './MemberDetails.css'; // Import the updated CSS file
import { deleteMemberById } from '../slices/memberSlice';

const MemberDetails: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const members = useSelector((state: RootState) => state.memberSlices.members.members);
  const member = members.find((mem: Member) => mem.id === Number(memberId)) as Member;

  const handleEdit = () => {
    navigate(`/members/${memberId}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      dispatch(deleteMemberById(member.id)).then(() => {
        console.log("delete sucsess");
      }).catch((error) => {
        console.error('Error delete member:', error);
      });
      navigate("/viewMembers")
    }
  };

  if (!member) {
    return <div className="member-details-container">Member not found</div>;
  }

  return (
    <div className="member-details-container">
      <h1>Details of {member.first_name} {member.last_name}</h1>
      <div className="member-details-frame">
        <div className="member-details-section">
          <h2>Personal Information</h2>
          <div className="member-details-content">
            <p><strong>Name:</strong> {member.first_name} {member.last_name}</p>
            <p><strong>Social Number:</strong> {member.social_number}</p>
            <p><strong>Date of Birth:</strong> {member.date_of_birth}</p>
            <p><strong>Phone:</strong> {member.phone}</p>
            <p><strong>Mobile Phone:</strong> {member.mobile_phone}</p>
            <p><strong>city:</strong> {member.city}</p>
            <p><strong>street:</strong> {member.street}</p>
            <p><strong>house number:</strong> {member.house_number}</p>

          </div>
        </div>
        <div className="member-details-section">
          <h2>Corona Details</h2>
          <div className="member-details-content">
            {(!member.corona_vaccines || member.corona_vaccines.length === 0) ? (
              <p><strong>Corona Vaccine:</strong> No vaccinations have been carried out so far</p>
            ) : (
              <>
                <p><strong>Corona Vaccine(s):</strong></p>
                {member.corona_vaccines.map((vaccine, index) => (
                  <div key={index}>
                    <p><strong>Vaccine {index + 1}:</strong></p>
                    <p><strong>Date Received:</strong> {vaccine.date_received}</p>
                    <p><strong>Manufacturer:</strong> {vaccine.manufacturer}</p>
                  </div>
                ))}
              </>
            )}
            <p><strong>Corona Vaccine:</strong> {member.corona_vaccines ? member.corona_vaccines.map(vaccine => `${vaccine.manufacturer}, `) : 'N/A'}</p>
            <p><strong>Is Sick:</strong> {member.is_sick ? 'Yes' : 'No'}</p>
            <p><strong>Date of Discovery:</strong> {member.discovery_date || 'N/A'}</p>
            <p><strong>Date of Recovery:</strong> {member.date_of_recovery || 'N/A'}</p>
          </div>
        </div>
      </div>
      <div className="member-details-actions">
        <button className="edit-button" onClick={handleEdit}>Edit</button>
        <button className="delete-button" onClick={handleDelete}>Delete</button>
        <Link to="/viewMembers" className="back-button">Back to Members</Link>
      </div>
    </div>
  );
};

export default MemberDetails;
