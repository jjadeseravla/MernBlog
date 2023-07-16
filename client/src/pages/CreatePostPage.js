import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': 'true'}],
    ['link', 'image'],
    ['clean']
  ]
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'imaage'
]
export default function CreatePostPage() {

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');

  async function createNewPost(e) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
    e.preventDefault();
    const response = await fetch('http://localhost:4000/post', {
      method: 'POST',
      body: data,
    });
    return response.json();
  }
  
  return (
    <div>
      <form onSubmit={createNewPost}>
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
        <ReactQuill
          value={content}
          modules={modules}
          formats={formats}
          onChange={(newVal) => setContent(newVal)} />
        <button style={{marginTop:'5px'}}>Create Post</button>
      </form>
    </div>
  )
}

// <textarea name="" id="" cols="30" rows="10"></textarea>
//instead of text area you can use react quill