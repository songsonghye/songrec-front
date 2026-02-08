import { useParams } from "react-router-dom";

export default function PlaylistDetail() {
  const { playlistId } = useParams();
  // playlistId로 api 이용해서 해당 playlist 데이터 fetch해오기

  return (
    <div>
      {/* 여기 #뒤에 playlist 제목으로 수정 */}
      <h2>{`플레이리스트 #${playlistId} 디테일`}</h2> 
      
    </div>
  );
}
