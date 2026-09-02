FROM node:24

WORKDIR /app

COPY package*.json ./

RUN --mount=type=secret,id=github_token \
        TOKEN="$(cat /run/secrets/github_token)" && \
        printf "@ugotalan2:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=%s\n" "$TOKEN" > /root/.npmrc && \
        npm ci && \
        rm -f /root/.npmrc

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]