# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :rubyfatt2,
  ecto_repos: [Rubyfatt2.Repo]

# Configures the endpoint
config :rubyfatt2, Rubyfatt2Web.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "aCluMuqhiTEOQHu9i3voKLuLYhyQB8JpMEIcV/wkHqzLtYjlVOPCRwpUUryYT9V6",
  render_errors: [view: Rubyfatt2Web.ErrorView, accepts: ~w(json)],
  pubsub: [name: Rubyfatt2.PubSub,
           adapter: Phoenix.PubSub.PG2],
   http: [
      protocol_options: [
        max_request_line_length: 8192,
        max_header_value_length: 8192
      ]
    ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:user_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# config :cors_plug,
#   origin: ["*"],
#   max_age: 86400,
#   methods: ["GET", "POST", "PUT", "DELETE"]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
