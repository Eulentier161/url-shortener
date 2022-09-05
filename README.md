# url shortener

[bit.ly](https://bitly.com/) like url-shortener / redirector.
a counter of hits for slug is available at `/stats/slug`. example for this projects redirect: [eule.wtf/stats/github](https://eule.wtf/stats/github)

## usage
visit the website at [eule.wtf](https://eule.wtf) or send a POST request like
```console
curl -X POST -H "Content-Type: application/json" -d '{"destination": "https://github.com/Eulentier161/url-shortener", "slug": "github"}' https://eule.wtf/api
```

## selfhosting

### with docker-compose

```console
git clone https://github.com/Eulentier161/url-shortener.git
cd url-shortener
cp example.env .env
sudo docker compose up -d
```

default port for the web interface is `5678`

### without docker

```console
git clone https://github.com/Eulentier161/url-shortener.git
cd url-shortener
cp example.env .env
nano .env
```

change the `DATABASE_URL` to a valid postgresql connection and save.

```console
pnpm install
pnpm build
pnpx prisma migrate deploy
pnpm run start
```
