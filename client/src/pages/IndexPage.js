import Post from "../Post";
import { useEffect, useState } from "react";


function IndexPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    //when go to /post
    fetch('http://localhost:4000/post').then(res => {
      //json has all the posts from homepage
      res.json().then(posts => { //async fns so use .then()
        console.log(posts)
        setPosts(posts);
      })
    })
  }, [])

  console.log(posts, '==============')

  //grab all the info from post by using spread operator
  return (
    <>
      {posts.length > 0 && posts.map((post) => (<Post {...post} />))}
    </>
  )
}

export default IndexPage;
