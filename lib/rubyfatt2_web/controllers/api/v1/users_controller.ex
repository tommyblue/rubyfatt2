defmodule Rubyfatt2Web.Api.V1.UsersController do
  use Rubyfatt2Web, :controller

  alias Rubyfatt2.Repo
  alias Rubyfatt2.User
  alias Rubyfatt2Web.Api.V1.ChangesetView

  def index(conn, _params) do
    render conn, "user.json", user: conn.assigns.signed_user
  end

  def create(conn, %{"profile" => profile}) do
    user = conn.assigns.signed_user
    changeset = User.profile_changeset(user, profile)

    case Repo.update(changeset) do
      {:ok, slip} ->
        conn
        |> put_status(:ok)
        |> render("user.json", user: user)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ChangesetView, "error.json", changeset: changeset)
    end
  end
end
