import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState({
    slug: "",
    destination: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setButtonDisabled(true);
    setNewUrl("")
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
      })
      .finally(() => setButtonDisabled(false));
  }

  return (
    <div>
      <form className="container">
        <p>
          https://eule.wtf/
          <input
            placeholder="slug"
            value={data.slug}
            onChange={(e) => setData({ ...data, slug: e.target.value })}
          />
        </p>
        <p>
          destination:&nbsp;
          <input
            placeholder="my destination"
            value={data.destination}
            onChange={(e) => setData({ ...data, destination: e.target.value })}
          />
        </p>
        <p>
          <button
            disabled={buttonDisabled || !data.destination || !data.slug}
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </button>
        </p>
        {newUrl ? (
          <p>
            Try your new url:{" "}
            <a href={newUrl} target="_blank" rel="noopener noreferrer">
              {newUrl}
            </a>
          </p>
        ) : null}
      </form>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}
