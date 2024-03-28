import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ViewMembers from '../components/viewMember'
import CreateMemberForm from '../components/createMemberForm'
import MemberDetails from '../components/memberDetails'
import EditMemberForm from '../components/editMemberForm'
import Navbar from '../components/navbar'

export default function Routing() {
  return (
    <div>
      <Routes>
      <Route path="/viewMembers" element={<ViewMembers />} />
        <Route path="/CreateMemberForm" element={<CreateMemberForm />} />
        <Route path="/members/:memberId" element={<MemberDetails />} />
        <Route path="/members/:memberId/edit" element={<EditMemberForm></EditMemberForm>} /> 
        <Route path="/" element={<Navbar></Navbar>} /> 

       </Routes>

    </div>
  )
}
