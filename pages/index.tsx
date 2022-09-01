import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState({
    slug: "",
    destination: "",
  });
  const [newUrl, setNewUrl] = useState("");

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    await axios
      .post("/api", data)
      .then((res) => {
        toast(res.data.message);
        setNewUrl(res.data.url);
      })
      .catch((err) => {
        console.log(err.response.status);
        if (err.response.status === 500) {
          setData({ ...data, slug: "" });
        } else if (err.response.status === 404) {
          setData({ ...data, destination: "" });
        } else {
          setData({ destination: "", slug: "" });
        }
        toast.error(err.response.data.message);
      });
  }

  return (
    <div>
      <form>
        <p>
          slug:{" "}
          <input
            placeholder="slug"
            value={data.slug}
            onChange={(e) => setData({ ...data, slug: e.target.value })}
          />
        </p>
        <p>
          destination:{" "}
          <input
            placeholder="my destination"
            value={data.destination}
            onChange={(e) => setData({ ...data, destination: e.target.value })}
          />
        </p>
        <button
          disabled={!data.destination || !data.slug}
          onClick={(e) => handleSubmit(e)}
        >
          Submit
        </button>
      </form>
      {newUrl ? (
        <p>
          Try your new url: <a href={newUrl}>{newUrl}</a>
        </p>
      ) : null}
      <ToastContainer />
    </div>
  );
}
