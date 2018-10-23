defmodule Rubyfatt2Web.Router do
  use Rubyfatt2Web, :router
  alias Rubyfatt2Web.Api

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :authenticate do
    plug Rubyfatt2Web.Plugs.Authenticate
  end

  scope "/", Rubyfatt2Web do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  # Other scopes may use custom stacks.
  scope "/api", Api do
    pipe_through :api

    scope "/session" do
      post "/sign_in", SessionController, :create
      delete "/sign_out", SessionController, :delete
    end

    scope "/v1", V1 do
      pipe_through :authenticate
    end
  end
end
