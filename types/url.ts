export default interface Url{
    id:number;
    slug:string;
    destination:string;
    redirects:   Redirect[];
}

interface Redirect {
    id: number;
    urlId: number;
    url: Url;
    timestamp: string;
  }