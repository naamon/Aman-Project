import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { putMember, createCoronaVaccine, getMembers } from '../slices/memberSlice';
import { AppDispatch, RootState } from '../app/store';
import { Member } from '../models/member';
import { CoronaVaccine } from '../models/coronaVaccine';
import './EditMemberForm.css'; // Import the CSS file



const EditMember: React.FC = () => {
    const { memberId } = useParams<{ memberId: string }>();
    const dispatch: AppDispatch = useDispatch();
    const [editedMember, setEditedMember] = useState<Member | null>(null);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const members = useSelector((state: RootState) => state.memberSlices.members.members);
    const [showVaccineFields, setShowVaccineFields] = useState<boolean>(false);
    const [newVaccine, setNewVaccine] = useState<CoronaVaccine>({
        id: 0,
        date_received: '',
        manufacturer: '',
    });

    const navigate = useNavigate();


    useEffect(() => {
        const member = members.find((mem: Member) => mem.id === Number(memberId));
        if (member) {
            setEditedMember(member);
        } else {
            setEditedMember(null);
        }
    }, [members, memberId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Clear previous error messages
        setErrorMessages([]);

        // Input validation
        if (name === 'is_sick' && value === 'false') {
            setEditedMember((prevMember) => ({
                ...prevMember as Member,
                [name]: false,
                discovery_date: null, // Reset discovery_date if is_sick is false
            }));
        } else if (name === 'discovery_date' && editedMember?.is_sick === false) {
            setErrorMessages(['Cannot update discovery date when member is not sick.']);
        } else {
            setEditedMember((prevMember) => ({
                ...prevMember as Member,
                [name]: name === 'is_sick' ? value === 'Yes' : value,
            }));
        }
    };

    const handleAddVaccine = () => {
        if (editedMember && editedMember.corona_vaccines.length < 4) {
            setShowVaccineFields(true);
        } else {
            setErrorMessages(['It is not possible to add a vaccine. Limit reached.']);
        }
    };

    const handleSaveVaccine = () => {
            dispatch(createCoronaVaccine({ Id: editedMember?.id || 0, coronaVaccineData: newVaccine }));
            // Reset vaccine fields and hide them after saving
            navigate('/members')    
        
        setNewVaccine({ id: 0, date_received: '', manufacturer: '' });
        setShowVaccineFields(false);

    };


    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check if social_number is being edited
        if (editedMember && editedMember.social_number !== null && editedMember.social_number.length !== 9) {
            setErrorMessages(['Israeli identity number must be 9 digits long.']);
            return;
        }

        if (editedMember) {
            // Check recovery date if provided
            if (editedMember.discovery_date && editedMember.date_of_recovery) {
                const discoveryDate = new Date(editedMember.discovery_date);
                const recoveryDate = new Date(editedMember.date_of_recovery);
                if (recoveryDate < discoveryDate) {
                    setErrorMessages(['Recovery date cannot be before discovery date.']);
                    return;
                }
            }
            dispatch(putMember(editedMember));
            navigate("/viewMembers");

        }
    };

    if (!editedMember) {
        return <div>Loading...</div>; // Add loading indicator or handle not found case
    }

    function handleDateChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { name, value } = e.target;
        if (name == "date_received"){
            const date_received = e.target.value;
            const dateObj = new Date(date_received);
            const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;
            setNewVaccine({ ...newVaccine, date_received: formattedDate });
    
        }
    }

    return (
        <div className="edit-member-container">
            <h2 className="form-title">Edit Member Details</h2>
            <form className="edit-member-form" onSubmit={handleFormSubmit}>
                <div className="error-messages">
                    {errorMessages.map((message, index) => (
                        <p key={index}>{message}</p>
                    ))}
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="first_name" className="form-label">
                            First Name <span className="required-indicator">*</span>:
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={editedMember.first_name}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name" className="form-label">
                            Last Name <span className="required-indicator">*</span>:
                        </label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={editedMember.last_name}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="social_number" className="form-label">
                            Social Number:
                        </label>
                        <input
                            type="text"
                            id="social_number"
                            name="social_number"
                            value={editedMember.social_number}
                            onChange={handleInputChange}
                            required
                            disabled 
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date_of_birth" className="form-label">
                            Date of Birth <span className="required-indicator">*</span>:
                        </label>
                        <input
                            type="date"
                            id="date_of_birth"
                            name="date_of_birth"
                            value={editedMember.date_of_birth}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="city" className="form-label">
                            City <span className="required-indicator">*</span>:
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={editedMember.city}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="street" className="form-label">
                            Street <span className="required-indicator">*</span>:
                        </label>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            value={editedMember.street}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="house_number" className="form-label">
                            House Number <span className="required-indicator">*</span>:
                        </label>
                        <input
                            type="text"
                            id="house_number"
                            name="house_number"
                            value={editedMember.house_number}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone" className="form-label">
                            Phone <span className="required-indicator">*</span>:
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={editedMember.phone}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="mobile_phone" className="form-label">
                            Mobile Phone:
                        </label>
                        <input
                            type="tel"
                            id="mobile_phone"
                            name="mobile_phone"
                            value={editedMember.mobile_phone}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="is_sick" className="form-label">
                            Is Sick <span className="required-indicator">*</span>:
                        </label>
                        <select
                            id="is_sick"
                            name="is_sick"
                            value={editedMember.is_sick ? 'Yes' : 'No'}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>
                {editedMember.is_sick && (
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="discovery_date" className="form-label">
                                Discovery Date <span className="required-indicator">*</span>:
                            </label>
                            <input
                                type="date"
                                id="discovery_date"
                                name="discovery_date"
                                value={editedMember.discovery_date || ''}
                                onChange={handleInputChange}
                                required={editedMember.is_sick}
                                className="form-input"
                            />
                        </div>
                    </div>
                )}
                {editedMember.is_sick && (
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="date_of_recovery" className="form-label">
                            Recovery Date:
                            </label>
                            <input
                                type="date"
                                id="date_of_recovery"
                                name="date_of_recovery"
                                value={editedMember.date_of_recovery || ''}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>
                    </div>
                )}
                <button onClick={handleAddVaccine} className="Vaccine-button">Add Corona Vaccine</button>
                <br></br>
                <br></br>
                {/* Vaccine fields */}
                {showVaccineFields && (
                    <div>
                        <h3>Add Vaccine Details</h3>
                        <label htmlFor="date_received">Date Received:</label>
                        <input
                            type="date"
                            id="date_received"
                            name="date_received"
                            // value={newVaccine.date_received}
                            onChange={handleDateChange}
                            required
                        />
                        <label htmlFor="manufacturer">Manufacturer:</label>
                        <input
                            type="text"
                            id="manufacturer"
                            name="manufacturer"
                            value={newVaccine.manufacturer}
                            onChange={(e) => setNewVaccine({ ...newVaccine, manufacturer: e.target.value })}
                            required
                        />
                        <button onClick={handleSaveVaccine} className="Vaccine-button">Save Vaccine</button>
                        <br></br>
                        <br></br>

                    </div>
                )}
                <div className="error-messages">
                    {errorMessages.map((message, index) => (
                        <p key={index}>{message}</p>
                    ))}
                </div>


                <button type="submit" className="submit-button">Save Changes</button>
            </form>
        </div>
    );
};

export default EditMember;
