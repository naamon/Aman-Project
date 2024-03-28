import React, { useEffect } from 'react'; // Import React and useEffect
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { getMembers } from '../slices/memberSlice';
import { Link } from 'react-router-dom';
import { Member } from '../models/member';


const ViewMembers: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const members: Member[] = useSelector((state: RootState) => state.memberSlices.members.members) || [];

  useEffect(() => {
    dispatch(getMembers());
  }, [dispatch]); // Add dispatch to the dependency array to fix the useEffect warning

  return (
    <div className="App">
      <h1>Members List</h1>
      {Array.isArray(members) && members.length > 0 ? (
      <ul>
      {members.map((member) => (
        <li key={member.id}>
          <Link to={`/members/${member.id}`}>{member.first_name} {member.last_name}</Link>
        </li>
      ))}
    </ul>
    ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViewMembers;
