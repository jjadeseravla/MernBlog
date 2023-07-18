import { formatISO9075 } from 'date-fns';

export default function Post({ title, summary, cover, content, createdAt, author }) {
  return (

    <div className="post">
      <div className="image">
          <img src={`../../api/${cover}`} alt="coverimage"/>
          </div>
       <div className="text">
        <h2>{title}</h2>
          <p className="info">
          <a href='https://www.collinsdictionary.com/dictionary/spanish-english/avasallar' className="author">{author.username}</a>
          <time>{ formatISO9075(new Date(createdAt), 'd MMM, yyyy, HH:mm')}</time>
          </p>
        <p className="summary">
            {summary}
        </p>
            {content}

      </div>
    </div>
  )
}