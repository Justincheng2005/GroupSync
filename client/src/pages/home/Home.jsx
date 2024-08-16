import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import "./home.scss"

const Home = () => {
  return (
    <div className="home">
      <Stories/>
      <Share/>
      <Posts/>
    </div>
    //< add to footer a target="_blank" href="https://icons8.com/icon/114100/plus">Plus</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
  )
}

export default Home