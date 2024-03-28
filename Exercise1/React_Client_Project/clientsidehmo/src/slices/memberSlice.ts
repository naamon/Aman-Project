import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Member } from '../models/member';
import { addMember, deleteMember, getAllMembers, updateMember } from '../services/memberService';
import { CoronaVaccine } from '../models/coronaVaccine';
import { addCoronaVaccine } from '../services/coronaVeccinesService';




export interface MemberState {
    members: any,
    status: boolean,
}
const initialState: MemberState = {
    members: [],
    status: false
}


// Asynchronous function to create a member
export const createMember = createAsyncThunk('members/createMember', async (member: Member) => {
    const { data } = await addMember(member);
    return data;
});

// Asynchronous function to get all members
export const getMembers = createAsyncThunk('members/getMembers', async () => {
    const { data } = await getAllMembers();
    return data;
});

export const deleteMemberById = createAsyncThunk(
    "member/delete",
    async (id: number) => {
        await deleteMember(id);
        return id;
    }
)

export const putMember = createAsyncThunk(
    'members/putMember',
    async (member: Member) => {
      const response = await updateMember(member.id, member);  // Call the updateMember function
      return response.data;  // Assuming the API returns the updated member object
    }
  );
  export const createCoronaVaccine = createAsyncThunk(
    'members/createCoronaVaccine',
    async ({ Id, coronaVaccineData }: { Id: number, coronaVaccineData: CoronaVaccine }) => {
        const { data } = await addCoronaVaccine(Id, coronaVaccineData);
        return data;
    }
);

  


const membersSlice = createSlice({
    name: 'members',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // If the getMembers action is fulfilled
        builder.addCase(getMembers.fulfilled, (state, action: PayloadAction<Member[]>) => {
            state.members = action.payload;
            console.log('Success: fetched all members');
            console.log("action.payloud", action.payload);
            state.members = action.payload
            console.log("state: ", state.members)

        });

        // If the getMembers action is rejected
        builder.addCase(getMembers.rejected, (state, action: PayloadAction<any>) => {
            console.log('Error: failed to fetch all members');
            console.log(action.payload);
        });

        // If the createMember action is fulfilled
        builder.addCase(createMember.fulfilled, (state, action: PayloadAction<Member>) => {
            console.log('Success: created a new member');
        });

        // If the createMember action is rejected
        builder.addCase(createMember.rejected, (state, action: PayloadAction<any>) => {
            console.log('Error: failed to create a new member');
            console.log(action.payload); // You can handle the error payload here
        });

        // builder.addCase(deleteMember.fullfilled, (state, action: PayloadAction<any>) => {
        //     let apartments = state.members.members.filter(x => x.id !== action.payload)
        //     state.members.members = apartments
        // });

        builder.addCase(putMember.fulfilled, (state, action: PayloadAction<Member>) => {
            console.log("update sucsessed")
            console.log(action.payload)
        });

        builder.addCase(putMember.rejected, (state, action: PayloadAction<any>) => {
            console.log('Error: failed to put member');
            console.log(action.payload); 
        });



    },
});

export default membersSlice.reducer;
