FROM node:16-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn global add pnpm && pnpm i;
RUN yarn run build
RUN npx prisma generate
