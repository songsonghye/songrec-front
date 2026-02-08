import { api } from "./APIHandler";

export async function getHello() {
  try{
    const hello = (await api.get('/hello-world'));
    return hello;
  }catch(error){
    console.error("Error: "+error);
    throw error;
  }
}