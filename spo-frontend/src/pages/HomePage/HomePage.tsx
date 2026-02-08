import { useEffect, useState} from "react";
import { getHello } from "../../API/HelloApi";
import { addUser, getUsers } from "../../API/users/UserApi";
import type { User } from "../../types/user";


export default function HomePage() {
  const [hello,setHello]=useState('');
  const [users,setUsers]=useState([]);
  const [isSubmitted, setSubmit] = useState(false);
  const [name,setName]=useState('');
  const [birthDate,setBirthDate]=useState('');

  useEffect(()=>{
    getHello().then((res)=>{
      setHello(res.data);
    }).catch(err=>{
      console.log("Err: "+err);
    });

    getUsers().then((res)=>{
      setUsers(res.data);
    })
  },[]);

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(isSubmitted) return;
    setSubmit(true);
    
    addUser({name,birthDate}).then((res)=>{
      console.log(res);
    }).catch(err=>{
      console.log("Err: "+err);
    });
    
    setName('');setBirthDate('');
  }
  
  return (
    <div>
      <h2>메인 화면</h2>
      <p>{hello}</p>
      {users?.map((user:User,i:number)=>(
        <div key={i}>
          <div>{user.id}</div>
          <div>{user.name}</div>
          <div>{user.birthDate}</div>
          </div>
      ))}
      <hr></hr>
      <form onSubmit={handleSubmit}>
        <label>name</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e)=> setName(e.target.value)} 
          required/>
        <label>birth_date</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e)=>setBirthDate(e.target.value)} required />
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
