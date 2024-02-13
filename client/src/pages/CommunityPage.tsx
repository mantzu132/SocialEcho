import Form from "../../components/form/Form.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store.ts";
import { useEffect } from "react";
import { getPostsAsync } from "../../state/post/postSlice.ts";

const CommunityPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getPostsAsync());
  }, [dispatch]);

  const posts = useSelector((state: RootState) => state.posts);
  return (
    <div>
      <h1>Showing all the posts from the database</h1>

      <div>
        {posts.map((post) => (
          <div key={post.title}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
          </div>
        ))}
      </div>

      <h1>Community Page</h1>
      <Form />
    </div>
  );
};

export default CommunityPage;
