import axios from 'axios'
import { CoronaVaccine } from '../models/coronaVaccine';

export const API = axios.create({
    baseURL: "http://localhost:5000/members"
});

export const addCoronaVaccine = (Id:number ,CoronaVaccine: CoronaVaccine) =>API.post(`/${Id}/corona_vaccines`, CoronaVaccine); 
