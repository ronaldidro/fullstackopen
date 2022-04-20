import BlogForm from "./BlogForm"
import Blogs from "./Blogs"
import Notification from "./Notification"

const Home = () => {
  return (
    <div>
      <Notification />
      <BlogForm />
      <Blogs />
    </div>
  )
}

export default Home