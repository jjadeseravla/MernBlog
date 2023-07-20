import { useState, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Navigate, useParams} from 'react-router-dom'
import Editor from '../Editor';

export default function EditPage() {
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [cover, setConver] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  
    useEffect(() => {
      fetch(`http://localhost:4000/post/${id}`).then(
        res => {
          res.json().then(
            postInfo => {
              setTitle(postInfo.title);
              setContent(postInfo.content);
              setSummary(postInfo.summary);
              setConver(postInfo.cover);
            }
          )
        }
      )
    }, [])

    
    async function updatePost(e) {
      e.preventDefault(); // cos you're submitting/sending a forms
      // grab all the info from state and create a form data from it
      const data = new FormData();
      data.set('title', title);
      data.set('summary', summary);
      data.set('cover', cover);
      data.set('content', content);
      data.set('id', id);
      data.set('files', files?.[0]); // incase this isnt an array of files
      const res = await fetch('http://localhost:4000/post', {
        method: 'PUT',
        body: data,
        credentials: 'include', // to send a cookie
      });
      if (res.ok) {
        setRedirect(true);
      }
    }
    
    if (redirect) {
      return <Navigate to={`/post/${id}`}/>
    }
  return (
    <div>
      <div>Edit Page</div>
      <form onSubmit={updatePost}>
        <input type="title"
          placeholder={'Title'}
          value={title}
          onChange={e => { setTitle(e.target.value) }}/>
        <input
          type="summary"
          placeholder={'Summary'}
          value={summary}
          onChange={e => setSummary(e.target.value)}/>
        <input
          type="file"
          onChange={(e) => { setFiles(e.target.files) }} />
       <Editor onChange={setContent} value={content} />
        <button style={{marginTop:'5px'}}>Update Post</button>
      </form>
    </div>
  )
}