import axios from 'axios';
import { useEffect, useState, useCallback, type ChangeEvent, type MouseEvent } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { validateSlug, validateUrl } from '../utils/validators';
import debounce from 'lodash.debounce';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

export default function Home({ uwu }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
        params: { slug }
      })
      .then((res) => {
        setSlugIsAvailable(res.data);
      });
  }, 500);

  const handleSlugInput = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    setSlugIsAvailable(null);
    setSlug(e.target.value);
    setSlugIsValid(validateSlug(e.target.value));
    checkSlugAvailability(e.target.value);
  }, []);

  const handleDestinationInput = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
    setUrlIsValid(validateUrl(e.target.value));
  }, []);

  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
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
    <div className={`container${uwu ? ' uwu' : ''}`}>
      <form>
        {newUrl ? (
          <>
            <p>
              Try your n{uwu && 'y'}ew url:{' '}
              <a href={newUrl} target="_blank" rel="noopener noreferrer">
                {newUrl}
              </a>
            </p>
            <button
              className="btn-enabled"
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
              N{uwu && 'Y'}AME?{uwu && " (⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)"}<br></br>
              <input
                className={slugIsValid && slugIsAvailable ? '' : 'invalidInput'}
                placeholder={uwu ? 'sluggy_wuggy' : 'slug'}
                value={slug}
                onChange={handleSlugInput}
              />
            </p>
            <p>
              WHERE <b>TO</b>?{uwu && ' (/▽＼*)｡o○♡'}<br></br>
              <input
                className={urlIsValid ? '' : 'invalidInput'}
                placeholder={uwu ? 'https://danbooru.donmai.us/' : 'https://github.com/Eulentier161/url-shortener'}
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
                <b>{uwu ? '~*NYAN' : 'GEN'}ERATE</b>
              </button>
            </p>
          </>
        )}
      </form>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return { props: { uwu: Object.keys(ctx.query).includes('uwu') } };
};