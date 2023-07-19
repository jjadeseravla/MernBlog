import { useEffect, useState } from 'react';
import {useParams} from "react-router-dom";

export default function PostPage() {

  const params = useParams();
  const [postInfo, setPostinfo] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/post/${params.id}`)
      .then(res => {
        res.json()
          .then(postInfo => {
          setPostinfo(postInfo)
        })
      })
  }, []);
  return (
    <div>post page</div>
  )
}