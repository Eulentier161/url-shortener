import axios from 'axios';
import React, { useEffect, useState, useCallback, ReactFragment } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { validateSlug, validateUrl } from '../utils/validators';
import debounce from 'lodash.debounce';

export default function Home() {
  const [slug, setSlug] = useState('');
  const [destination, setDestination] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [slugIsAvailable, setSlugIsAvailable] = useState<boolean | null>(null);
  const [slugIsValid, setSlugIsValid] = useState(false);
  const [urlIsValid, setUrlIsValid] = useState(false);

  useEffect(() => {
    setButtonDisabled(!(slugIsValid && urlIsValid && slugIsAvailable));
  }, [slugIsValid, urlIsValid, slugIsAvailable]);

  const checkSlugAvailability = debounce((slug: string) => {
    axios
      .get('/api/slug-available', {
        params: { slug },
      })
      .then((res) => {
        setSlugIsAvailable(res.data);
      });
  }, 500);

  const handleSlugInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugIsAvailable(null);
    setSlug(e.target.value);
    setSlugIsValid(validateSlug(e.target.value));
    checkSlugAvailability(e.target.value);
  }, []);

  const handleDestinationInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
    setUrlIsValid(validateUrl(e.target.value));
  }, []);

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setButtonDisabled(true);
    await axios
      .post('/api', { slug, destination })
      .then((res) => {
        toast(res.data.message);
        setNewUrl(res.data.url);
      })
      .catch((err) => {
        if (err.response.status === 500) {
          setSlug('');
        } else if (err.response.status === 404) {
          setDestination('');
        } else {
          setSlug('');
          setDestination('');
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
                setSlug('');
                setDestination('');
                setSlugIsValid(false);
                setUrlIsValid(false);
                setSlugIsAvailable(null);
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
                className={slugIsValid && slugIsAvailable ? '' : 'invalidInput'}
                placeholder='slug'
                value={slug}
                onChange={handleSlugInput}
              />
            </p>
            <p>
              WHERE <b>TO</b>?<br></br>
              <input
                className={urlIsValid ? '' : 'invalidInput'}
                placeholder='https://github.com/Eulentier161/url-shortener'
                value={destination}
                onChange={handleDestinationInput}
              />
            </p>
            <p>
              <button
                className={buttonDisabled ? 'btn-disabled' : 'btn-enabled'}
                disabled={buttonDisabled}
                onClick={handleSubmit}
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
