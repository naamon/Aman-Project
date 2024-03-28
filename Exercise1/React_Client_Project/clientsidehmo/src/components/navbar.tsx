import React from 'react'
import { useNavigate } from 'react-router-dom'

export function Navbar() {

    const navigate = useNavigate()

  return (
    <>
        <h1>HMO Project - home page</h1>

    <div style={{ display: 'flex', justifyContent: 'center', paddingTop:'10%'}}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <br></br>

        <button
          style={{
            padding: '15px 30px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s ease-in-out',

          }}
          onClick={() => {
            navigate('/viewMembers')
          }}
        >
          view members
        </button>
        <button
          style={{
            padding: '15px 30px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s ease-in-out',
          }}

          onClick={() => {
            navigate('/CreateMemberForm')
          }}
        >
          Add Member
        </button>
      </div>

    </div>
    </>
  )
  
}
export default Navbar;