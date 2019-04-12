# Rubyfatt2

## Deploy with Heroku

Rubyfatt2 can be deployed using a free Heroku tier (although it will only run for
some hours each day).

Once registered, you need to install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
and make login from console with `heroku login`.

Then you can create the app and set it as a container (so that it can be run as Docker):

```
heroku create <app_name>
heroku stack:set container
heroku container:login
```

You can now add the free PostgreSQL addon:.

```
heroku addons:create heroku-postgresql:hobby-dev
```

Let's add some env variables. The `secret` can be easily generated with `mix phx.gen.secret`:

```
heroku config:set SECRET_KEY_BASE="<secret>"
heroku config:set POOL_SIZE=18
heroku config:set MIX_ENV="prod"
```

To build and deploy the app:

```
cd deploy
./release_heroku.sh
```

You can check the deploy status with `heroku logs -t` and the open the app with `heroku open`

## Local development

To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](http://www.phoenixframework.org/docs/deployment).

## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: http://phoenixframework.org/docs/overview
  * Docs: https://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix
