import { formatISO9075 } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Post({ _id, title, summary, cover, content, createdAt, author }) {
  
  console.log(author, 'author')
  return (
    <div className="post">
      <div className="image">
      <Link to={`post/${_id}`}>
          <img src={'http://localhost:4000/'+cover} alt="coverimage"/>
          </Link>    
      </div>
       <div className="texts">
        <Link to={`post/${_id}`}>
        <h2>{title}</h2>
        </Link>
          <p className="info">
          <Link to={'/'} className="author">jade</Link>
          <time>{ formatISO9075(new Date(createdAt), 'd MMM, yyyy, HH:mm')}</time>
          </p>
        <p className="summary">
            {summary}
        </p>
            {/* {content} */}

      </div>
    </div>
  )
}
