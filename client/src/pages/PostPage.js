import { useEffect, useState, useContext} from 'react';
import { useParams } from "react-router-dom";
import { formatISO9075 } from 'date-fns';
import { UserContext } from '../UserContext';
import { Link } from 'react-router-dom';

export default function PostPage() {
  const params = useParams();
  const [postInfo, setPostinfo] = useState(null);
  const {userInfo} = useContext(UserContext)

  useEffect(() => {
    fetch(`http://localhost:4000/post/${params.id}`)
      .then(res => {
        res.json()
          .then(postInfo => {
          setPostinfo(postInfo)
        })
      })
  }, []);

  if (!postInfo) return '';

  return (
    <div className='post-page'>
      <h1>
        {postInfo.title}
      </h1>
      <time>{formatISO9075(new Date())}</time>
      <div className='author'>by {postInfo.author.username}</div>
      {userInfo.id === postInfo.author._id && (
        <div className='edit-row'>
          <Link className='edit-btn' to={`/edit/${postInfo._id}`}>Edit this post</Link>
          </div>
      )}
      <div className='image'>
        <img src={`http://localhost:4000/${postInfo.cover}`} alt='postpageimg'/>
      </div>
      <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
    </div>
  )
}

//line 28 if you want to print html from a string