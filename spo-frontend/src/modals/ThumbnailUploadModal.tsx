import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";

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
    isOpen:boolean
    onClose:()=>void;
    fileInputRef:React.RefObject<HTMLInputElement | null>;
    uploadThumbnail :  (file: File) => Promise<void>;
    preview:string;
}

export default function ThumbnailUploadModal({isOpen,onClose,fileInputRef,uploadThumbnail,preview}:Props){
    const [previewUrl,setPreviewUrl] = useState<string|null>(preview);
    const [selectedFile, setSelectedFile]=useState<File|null>(null);
    const [isUploading,setUploading]=useState(false);
    const [error,setError] = useState<string|null>(null);

    useEffect(()=>{
        setPreviewUrl(preview);
    },[preview]);

    const handleClickThumbnail = ()=>{
        fileInputRef.current?.click();
    }

    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0];
        if(!file) return;

        if(!file.type.startsWith("image/")){
            setError("이미지 파일만 업로드할 수 있어요.");
            e.target.value="";
            return;
        }

        if(previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
        const nextPreview = URL.createObjectURL(file);

        setSelectedFile(file);
        setPreviewUrl(nextPreview);

        e.target.value="";
    }

    const handleSubmit = async()=>{
        if(!selectedFile){
            setError("업로드할 파일을 먼저 선택해주세요.");
            return;
        }
        if(isUploading) return;

        try{
            setUploading(true);
            setError(null);
            await uploadThumbnail(selectedFile);
        }catch(err){
            setError("업로드에 실패했어요. 잠시 후 다시 시도해주세요.");
            console.log(err);
        }finally{
            setUploading(false);
        }
    }
    
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customModalStyles}
            ariaHideApp={false}
            contentLabel="Upload Thumbnail"
            shouldCloseOnOverlayClick={true}
        >
            <div onClick={handleClickThumbnail} style={{ display: "inline-block" }}>
                <img
                  src={previewUrl ?? "/images/default-music-icon.png"}
                  alt=""
                  style={{ width: 100, cursor: "pointer" }}
                />
            </div>

            <input 
                type="file"
                accept="image/*"
                ref={fileInputRef}
                hidden
                onChange={handleFileChange}
                />
            <button onClick={handleSubmit} disabled={isUploading || !selectedFile}>
                {isUploading?"업로드 중...":"저장"}
            </button>

            {error && <p style={{ marginTop: 8 }}>{error}</p>}
        </ReactModal>
    )
}