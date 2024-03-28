import axios from 'axios'
import { Member } from "../models/member"

export const API = axios.create({
    baseURL: "http://localhost:5000/members"
});

export const addMember = (newMember: Member) =>API.post("", newMember); 
export const getAllMembers = () => API.get("");
export const deleteMember = (id: number) => API.delete(`/${id}`)
export const updateMember = (id: Number, member: Member) => API.put(`/${id}`, member);
