import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { validateSlug, validateUrl } from '../utils/validators';

export default function Home() {
  const [data, setData] = useState({
    slug: '',
    destination: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [slugIsValid, setSlugIsValid] = useState(false);
  const [urlIsValid, setUrlIsValid] = useState(false);

  useEffect(() => {
    setButtonDisabled(!(slugIsValid && urlIsValid));
  }, [slugIsValid, urlIsValid]);

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setButtonDisabled(true);
    await axios
      .post('/api', data)
      .then((res) => {
        toast(res.data.message);
        setNewUrl(res.data.url);
      })
      .catch((err) => {
        if (err.response.status === 500) {
          setData({ ...data, slug: '' });
        } else if (err.response.status === 404) {
          setData({ ...data, destination: '' });
        } else {
          setData({ destination: '', slug: '' });
        }
        toast.error(err.response.data.message);
      })
      .finally(() => setButtonDisabled(false));
  }

  return (
    <div className='container'>
      <form>
        {newUrl ? (
          <>
            <p>
              Try your new url:{' '}
              <a href={newUrl} target='_blank' rel='noopener noreferrer'>
                {newUrl}
              </a>
            </p>
            <button
              className='btn-enabled'
              onClick={() => {
                setData({ destination: '', slug: '' });
                setSlugIsValid(false);
                setUrlIsValid(false);
                setNewUrl('');
              }}
            >
              BACK
            </button>
          </>
        ) : (
          <>
            <p>
              NAME?<br></br>
              <input
                className={slugIsValid ? '' : 'invalidInput'}
                placeholder='slug'
                value={data.slug}
                onChange={(e) => {
                  setData({ ...data, slug: e.target.value });
                  setSlugIsValid(validateSlug(e.target.value));
                }}
              />
            </p>
            <p>
              WHERE <b>TO</b>?<br></br>
              <input
                className={urlIsValid ? '' : 'invalidInput'}
                placeholder='https://github.com/Eulentier161/url-shortener'
                value={data.destination}
                onChange={(e) => {
                  setData({ ...data, destination: e.target.value });
                  setUrlIsValid(validateUrl(e.target.value));
                }}
              />
            </p>
            <p>
              <button
                className={buttonDisabled ? 'btn-disabled' : 'btn-enabled'}
                disabled={buttonDisabled}
                onClick={(e) => handleSubmit(e)}
              >
                <b>GENERATE</b>
              </button>
            </p>
          </>
        )}
      </form>
      <ToastContainer position='bottom-right' theme='dark' />
    </div>
  );
}
