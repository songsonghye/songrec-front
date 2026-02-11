import { useState } from "react";
import ReactModal from "react-modal";
import { addRequest } from "../API/users/RequestApi";

const customModalStyles: ReactModal.Styles = {
  overlay: {
    backgroundColor: " rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: "100vh",
    zIndex: "10",
    position: "fixed",
    top: "0",
    left: "0",
  },
  content: {
    width: "360px",
    height: "180px",
    zIndex: "150",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
    backgroundColor: "white",
    justifyContent: "center",
    overflow: "auto",
  },
};

interface Props{
    isOpen:boolean;
    onClose:()=>void;
    onCreated: (newId: number) => Promise<void>|void;
}

export default function PlaylistCreateModal({isOpen,onClose,onCreated}:Props){
    const [isSubmitting,setSubmitting]=useState(false);
    const [title,setTitle]=useState('');

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(isSubmitting) return;
        
        try{
            setSubmitting(true);
            const res = await addRequest(2,title);
            setTitle("");
            await onCreated(res.data.id);
        }catch(err){
            console.log("Err: ",err);
        }finally{
            setSubmitting(false);
        }
      }
    
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customModalStyles}
            ariaHideApp={false}
            contentLabel="Create Playlist"
            shouldCloseOnOverlayClick={true}
        >
            <form onSubmit={handleSubmit}>
                <label>title</label>
                <input 
                    type="text"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    required/>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting?"saving...":"submit"}
                </button>
            </form>
        </ReactModal>
    )
}