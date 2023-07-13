import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePostPage() {
  return (
    <div>
      <form>
        <input title="title" placeholder={'Title'}></input>
        <input title="summary" placeholder={'Summary'}></input>
        <input title="file" />
        <ReactQuill/>
      </form>
    </div>
  )
}

// <textarea name="" id="" cols="30" rows="10"></textarea>
//instead of text area you can use react quill