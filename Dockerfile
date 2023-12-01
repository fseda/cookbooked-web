FROM oven/bun:latest

WORKDIR /usr/src/app

COPY . .

RUN bun install

ENV VITE_API_URL https://cookbooked-api-deploy-170e.up.railway.app
ENV ORIGIN https://cookbooked-web-deploy.up.railway.app

RUN bun run build

EXPOSE 3000


CMD ["bun", "./build/index.js"]

# FROM oven/bun:1 as base
# WORKDIR /usr/src/app

# FROM base AS install
# RUN mkdir -p /temp/dev
# COPY package.json bun.lockb /temp/dev/
# RUN cd /temp/dev && bun install --frozen-lockfile

# RUN mkdir -p /temp/prod
# COPY package.json bun.lockb /temp/prod/
# RUN cd /temp/prod && bun install --frozen-lockfile --production

# FROM install AS prerelease
# COPY --from=install /temp/dev/node_modules node_modules
# COPY . .

# ENV NODE_ENV=production
# RUN bun test
# RUN bun run build

# FROM base AS release
# COPY --from=install /temp/prod/node_modules node_modules
# COPY --from=prerelease /usr/src/app/index.ts .
# COPY --from=prerelease /usr/src/app/package.json .

# USER bun
# EXPOSE 3000/tcp

# ENTRYPOINT ["bun", "./build/index.js"]
