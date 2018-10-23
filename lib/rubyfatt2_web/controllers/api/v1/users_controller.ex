defmodule Rubyfatt2Web.Api.V1.UsersController do
  use Rubyfatt2Web, :controller

  alias Rubyfatt2.Repo
  alias Rubyfatt2.User

  def index(conn, _params) do
    users = Repo.all(User)
    render conn, "index.json", users: users
  end
end
