import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMember } from '../slices/memberSlice';
import { AppDispatch, RootState } from '../app/store';
import { Member } from '../models/member';
import './CreateMemberForm.css'; // Import your CSS file for styling
import { useNavigate } from 'react-router-dom';


const CreateMemberForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const members = useSelector((state: RootState) => state.memberSlices.members.members) || [];
  const navigate = useNavigate();
  const [newMember, setNewMember] = useState<Member>({
    id: 0,
    first_name: '',
    last_name: '',
    date_of_birth: '',
    social_number: '',
    phone: '',
    city: '',
    street: '',
    house_number: '',
    mobile_phone: '',
    corona_vaccines: [],
    is_sick: false,
    discovery_date: '',
    date_of_recovery: '',
    image: null,
  });
  const [errors, setErrors] = useState<Partial<Member>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'date_of_birth') {
      setNewMember((prevMember) => ({
        ...prevMember,
        date_of_birth: value,
      }));
    } else if (name === 'is_sick') {
      const isSick = value === 'true';
      setNewMember((prevMember) => ({
        ...prevMember,
        is_sick: isSick,
        discovery_date: isSick ? prevMember.discovery_date : '', // Reset discovery_date if is_sick is false
      }));
    } else {
      setNewMember((prevMember) => ({
        ...prevMember,
        [name]: value === 'true' ? true : value === 'false' ? false : value,
      }));
    }
  };

  const validateIsraeliId = (socialNumber: string): boolean => {
    // Check if the input is alphanumeric (may contain letters and digits)
    if (!/^[a-zA-Z0-9]+$/.test(socialNumber)) {
      return false;
    }

    // Extract the digits and letters for validation
    const digits: number[] = [];
    const letters: string[] = [];
    for (const char of socialNumber) {
      if (/\d/.test(char)) {
        digits.push(parseInt(char, 10));
      } else if (/[a-zA-Z]/.test(char)) {
        letters.push(char);
      } else {
        // Invalid character
        return false;
      }
    }

    // Calculate the checksum based on the Israeli ID algorithm
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      let digit = digits[i];
      if ((digits.length + letters.length) % 2 === 0) {
        // Even length: double every second digit starting from the first digit
        if (i % 2 === 0) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
      } else {
        // Odd length: double every second digit starting from the second digit
        if (i % 2 !== 0) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
      }
      sum += digit;
    }

    // Validate the checksum
    return sum % 10 === 0;
  };



  const validateInput = () => {
    let isValid = true;
    const newErrors: Partial<Member> = {};
    const isValidIsraeliId = validateIsraeliId(newMember.social_number || '');

    if (!isValidIsraeliId) {
      newErrors.social_number = 'Social number must be a valid Israeli ID number';
      isValid = false;
    }

    const isUniqueSocialNumber = !members.some((member: Member) => member.social_number === newMember.social_number && member.social_number !== '');
    if (isUniqueSocialNumber) {
      newErrors.social_number = 'Social number must be unique';
      isValid = false;
    }

    if (newMember.is_sick && !newMember.discovery_date) {
      newErrors.discovery_date = 'Discovery date is required if member is sick';
      isValid = false;
    }

    if (newMember.date_of_recovery && newMember.discovery_date && new Date(newMember.date_of_recovery || '') <= new Date(newMember.discovery_date)) {
      newErrors.date_of_recovery = 'Recovery date must be after discovery date';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateInput()) {
      // Convert date fields to string before creating member
      const newMemberToSend: Member = {
        ...newMember,
        date_of_birth: newMember.date_of_birth,
        discovery_date: newMember.is_sick && newMember.discovery_date ? newMember.discovery_date : '',
        date_of_recovery: newMember.date_of_recovery ? newMember.date_of_recovery : '',
      };
      console.log("new member: ", newMember)
      dispatch(createMember(newMemberToSend)).then(() => {
        navigate("/viewMembers")
      }).catch((error) => {
        console.error('Error creating member:', error);
      });
    }
  };


  return (
    <div className="create-member-container">
      <h2 className="form-title">Create Member</h2>
      <form onSubmit={handleFormSubmit} className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first_name">First Name <span className="required-indicator">*</span>:</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={newMember.first_name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            {errors.first_name && <p className="error-message">{errors.first_name}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name <span className="required-indicator">*</span>:</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={newMember.last_name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            {errors.last_name && <p className="error-message">{errors.last_name}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date_of_birth">Date of Birth <span className="required-indicator">*</span>:</label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={newMember.date_of_birth}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            {errors.date_of_birth && <p className="error-message">{errors.date_of_birth}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="social_number">Social Number <span className="required-indicator">*</span>:</label>
            <input
              type="text"
              id="social_number"
              name="social_number"
              value={newMember.social_number}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            {errors.social_number && <p className="error-message">{errors.social_number}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone <span className="required-indicator">*</span>:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={newMember.phone}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            {errors.phone && <p className="error-message">{errors.phone}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="city">City <span className="required-indicator">*</span>:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={newMember.city}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            {errors.city && <p className="error-message">{errors.city}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="street">Street <span className="required-indicator">*</span>:</label>
            <input
              type="text"
              id="street"
              name="street"
              value={newMember.street}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            {errors.street && <p className="error-message">{errors.street}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="house_number">House Number <span className="required-indicator">*</span>:</label>
            <input
              type="text"
              id="house_number"
              name="house_number"
              value={newMember.house_number}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            {errors.house_number && <p className="error-message">{errors.house_number}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="mobile_phone">Mobile Phone:</label>
            <input
              type="tel"
              id="mobile_phone"
              name="mobile_phone"
              value={newMember.mobile_phone}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="is_sick">Is Sick <span className="required-indicator">*</span>:</label>
            <select
              id="is_sick"
              name="is_sick"
              value={newMember.is_sick ? 'true' : 'false'}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        {newMember.is_sick && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="discovery_date">Discovery Date <span className="required-indicator">*</span>:</label>
              <input
                type="date"
                id="discovery_date"
                name="discovery_date"
                value={newMember.discovery_date || ""} 
                onChange={handleInputChange}
                className="form-input"
                required={newMember.is_sick}
              />
              {errors.discovery_date && <p className="error-message">{errors.discovery_date}</p>}
            </div>
          </div>
        )}

        {newMember.is_sick && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date_of_recovery">Date of Recovery:</label>
              <input
                type="date"
                id="date_of_recovery"
                name="date_of_recovery"
                value={newMember.date_of_recovery || ""}
                onChange={handleInputChange}
                className="form-input"
              />
              {errors.date_of_recovery && <p className="error-message">{errors.date_of_recovery}</p>}
            </div>
          </div>
        )}

        <button type="submit" className="submit-button">Create Member</button>
      </form>
    </div>
  );
};

export default CreateMemberForm;
