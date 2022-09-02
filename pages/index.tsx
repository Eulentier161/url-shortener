import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Home() {
  const [data, setData] = useState({
    slug: "",
    destination: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [urlIsValid, setUrlIsValid] = useState(true);

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setButtonDisabled(true);
    setNewUrl("");
    await axios
      .post("/api", data)
      .then((res) => {
        toast(res.data.message);
        setNewUrl(res.data.url);
      })
      .catch((err) => {
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
    <div className="container">
      <form>
        {newUrl ? (
          <p>
            Try your new url:{" "}
            <a href={newUrl} target="_blank" rel="noopener noreferrer">
              {newUrl}
            </a>
          </p>
        ) : (
          <>
            <p>
              NAME?<br></br>
              <input
                placeholder="slug"
                value={data.slug}
                onChange={(e) => setData({ ...data, slug: e.target.value })}
              />
            </p>
            <p>
              WHERE <b>TO</b>?<br></br>
              <input
                className={urlIsValid ? "" : "invalidUrl"}
                placeholder="https://github.com/Eulentier161/url-shortener"
                value={data.destination}
                onChange={(e) => {
                  setData({ ...data, destination: e.target.value });
                  setUrlIsValid(
                    e.target.value.startsWith("https://") ||
                      e.target.value.startsWith("http://")
                  );
                }}
              />
            </p>
            <p>
              <button
                disabled={
                  buttonDisabled ||
                  !urlIsValid ||
                  !data.destination ||
                  !data.slug
                }
                onClick={(e) => handleSubmit(e)}
              >
                <b>GENERATE</b>
              </button>
            </p>
          </>
        )}
      </form>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}
