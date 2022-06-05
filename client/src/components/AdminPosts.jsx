import React, { useState, useEffect, useContext } from "react";
import banner from "./gitbanner.png";
import userContext from "./UserContext";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

function AdminPosts() {
  const { user } = useContext(userContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [pdf, setPdf] = useState("");
  const [batch, setBatch] = useState("");
  const [batches, setBatches] = useState([]);
  const [postsWithImage, setPostsWithImage] = useState([]);
  const [isImageAdded, setIsImageAdded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    getBatches();
  }, [user, navigate]);

  const HandleSubmit = (e) => {
    e.preventDefault();
  };

  const HandleFilter = (e) => {
    e.preventDefault();
    setIsImageAdded(false);

    if (batch) {
      getPosts(batch);
    } else {
      window.alert("Please select a batch");
    }
  };

  const getPosts = async (batch) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/getposts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batch: batch,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.error) {
        window.alert(data.error);
      } else if (!data.message) {
        window.alert("No posts found");
      } else {
        setPosts(data.message);
        addImages();
      }
    } catch (error) {
      window.alert(error.message);
      setIsLoading(false);
    }
  };

  const getBatches = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/getBatches", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setIsLoading(false);
      if (!result.message || result.error) {
        window.alert("Something went wrong please try again");
      } else {
        setBatches(result.message);
      }
    } catch (error) {
      window.alert(error.message);
      setIsLoading(false);
    }
  };

  const addImages = async () => {
    try {
      const newPosts = [];
      posts.map(async (post, i) => {
        const pp = {};
        pp.title = post.title;
        pp.description = post.description;
        pp.image = post.image;
        pp.pdf = post.pdf;
        pp.batch = post.batch;
        pp.id = post._id;
        pp.imageURL = await getImages(post.image);
        pp.date = post.date;
        newPosts.push(pp);
        setPostsWithImage(newPosts);
        if (i === posts.length - 1) {
          setIsImageAdded(true);
        }
      });
      console.log(postsWithImage);
    } catch (error) {
      window.alert(error.message);
    }
  };

  const getImages = async (imageName) => {
    try {
      const response = await fetch("http://localhost:5000/api/fetchImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageName: imageName,
        }),
      });
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error(`get: error occurred ${error}`);
    }
  };

  return (
    <div>
      {isLoading ? <Loading /> : ""}
      <nav>
        <div>
          <div className="nav-container">
            <img src={banner} alt="Banner" className="git-banner" />
            <h1>KLS Gogte Institute of Technology</h1>
          </div>
        </div>
      </nav>
      <div className="main-container">
        <div className="form-container">
          <h2>Add New Post</h2>
          <form id="student-form" onSubmit={HandleSubmit}>
            <label className="post-details">
              Title:
              <input
                className="input-col"
                type="text"
                name="Title"
                value={title}
                placeholder="Your Title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="post-details">
              Description:
              <textarea
                className="input-col"
                type="text"
                name="Description"
                value={description}
                placeholder="Your Description"
                onChange={(e) => setDescription(e.target.value)}
                style={{ height: "200px", textJustify: "top" }}
              ></textarea>
            </label>
            <label className="post-details">
              Batch:
              <select
                className="input-col"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
              >
                <option>Select a Batch</option>
                {batches.map((batch, i) => (
                  <option key={i} value={batch.batch}>
                    {batch.batch}
                  </option>
                ))}
              </select>
            </label>
            <label className="post-details">
              Image:
              <input
                className="input-col"
                type="file"
                name="Image"
                value={image}
                placeholder="Your image"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            <label className="post-details">
              PDF:
              <input
                className="input-col"
                type="file"
                name="PDF"
                value={pdf}
                placeholder="Your PDF"
                onChange={(e) => setPdf(e.target.files[0])}
              />
            </label>
            <input className="submit-button" type="submit" value="POST" />
          </form>
        </div>
      </div>
      <div className="main-container">
        <div className="form-container">
          <form onSubmit={HandleFilter}>
            <label className="column">
              Fliter By:
              <select
                className="input-col"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
              >
                <option>Select a Batch</option>
                {batches.map((batch, i) => (
                  <option key={i} value={batch.batch}>
                    {batch.batch}
                  </option>
                ))}
              </select>
            </label>
            <input className="login-button" type="submit" value="Filter" />
          </form>
        </div>
      </div>
      <div className="main-container">
        <div className="form-container">
          {isImageAdded ? (
            postsWithImage.length === posts.length ? (
              <div>
                {postsWithImage.map((post, i) => (
                  <div key={i} className="post-container">
                    <div className="post-text">
                      <h2>{post.title}</h2>
                      <img
                        className="post-image"
                        src={post.imageURL}
                        alt="PostImage"
                      />
                    </div>
                    <div className="post-text">
                      <h3>{post.description}</h3>
                      <div className="post-batch">
                        <h5>{post.batch}</h5>
                        <h6>{post.date}</h6>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No posts found</div>
            )
          ) : (
            <div>No posts found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPosts;
