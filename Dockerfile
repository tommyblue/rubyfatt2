FROM elixir:latest

ARG SECRET_KEY_BASE

ENV MIX_ENV=prod
ENV MIX_HOME=/root/.mix

RUN apt-get update \
    && apt-get install --no-install-recommends --yes apt-transport-https \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash - \
    && apt-get update \
    && apt-get install --no-install-recommends --yes \
    build-essential \
    inotify-tools \
    postgresql-client \
    nodejs \
    yarn \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /root/.cache

ADD . ./

RUN mix local.rebar --force \
    && mix local.hex --force \
    && mix deps.get --only prod \
    && mix compile \
    && mix phx.digest

WORKDIR frontend
RUN yarn -v && yarn install && yarn run webpack -p && rm -rf node_modules/
WORKDIR ..

CMD mix ecto.migrate && mix phx.server
