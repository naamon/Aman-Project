import { CoronaVaccine } from "./coronaVaccine";

export interface Member {
    id: number;
    first_name: string;
    last_name: string;
    social_number: string;
    date_of_birth: string;
    city: string;
    street: string;  
    house_number: string; 
    phone: string;
    mobile_phone: string;
    corona_vaccines: CoronaVaccine[];
    is_sick: boolean;
    discovery_date: string | null;
    date_of_recovery: string | null;
    image: string | null;
  }
  