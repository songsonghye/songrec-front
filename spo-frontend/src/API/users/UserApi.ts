import type { User } from "../../types/user";
import { api } from "../APIHandler";

export async function getUsers() {
    try{
        const users = await api.get('/jpa/users');
        return users;
    }catch(error){
    console.error("Error: "+error);
    throw error;
  }
}

export async function getUser(userId:number) {
    try{
        const userInfo = await api.get(`/jpa/users/${userId}`);
        return userInfo;
    }catch(error){
    console.error("Error: "+error);
    throw error;
  }
}

export async function addUser({id,name,birthDate}:User) {
  try{
    const data={id,name,birthDate};
    const response = await api.post('/jpa/users',data);
    return response;
  }catch(error){
    console.error("Error: "+error);
    throw error;
  }
}