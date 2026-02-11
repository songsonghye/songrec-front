import { useEffect, useState} from "react";
import { addUser, getUsers } from "../../API/users/UserApi";
import type { User } from "../../types/user";


export default function HomePage() {
  const [users,setUsers]=useState([]);
  const [isSubmitted, setSubmit] = useState(false);
  const [name,setName]=useState('');
  const [password,setPassword]=useState('');

  useEffect(()=>{

    getUsers().then((res)=>{
      setUsers(res.data);
    })
  },[]);

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(isSubmitted) return;
    setSubmit(true);
    
    addUser({name,password}).then((res)=>{
      console.log(res);
    }).catch(err=>{
      console.log("Err: "+err);
    });
    setName('');setPassword('');
  }
  
  return (
    <div>
      <h2>메인 화면</h2>
      <h3>hello!</h3>
      {users?.map((user:User,i:number)=>(
        <div key={i}>
          <div>{user.id}</div>
          <div>{user.name}</div>
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
        <label>password</label>
        <input 
          type="text" 
          value={password} 
          onChange={(e)=> setPassword(e.target.value)} 
          required/>
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
