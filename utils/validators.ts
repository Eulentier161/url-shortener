import { NextApiRequest } from 'next';

export function validateUrl(url: string) {
  if (!url) return false;
  if (!/https?:\/\//.test(url)) return false;
  if (!url.includes('.')) return false;
  if (url.endsWith('.')) return false;
  if (typeof window !== 'undefined') {
    if (url.includes(`://${window.location.hostname}`)) return false;
  }
  return true;
}

export function validateSlug(slug: string) {
  const match = slug.match(/\w{1,100}/);
  if (match && match[0] == slug) return true;
  return false;
}
