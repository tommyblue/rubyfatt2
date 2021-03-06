defmodule Rubyfatt2Web.Plugs.Authenticate do
  import Plug.Conn
  def init(default), do: default

  def call(conn, _default) do
    case Rubyfatt2.Services.Authenticator.get_auth_token(conn) do
      {:ok, token} ->
        case Rubyfatt2.Repo.get_by(Rubyfatt2.AuthToken, %{token: token, revoked: false})
        |> Rubyfatt2.Repo.preload(:user) do
          nil -> unauthorized(conn)
          auth_token -> authorized(conn, auth_token.user)
        end
      _ -> unauthorized(conn)
    end
  end

  defp authorized(conn, user) do
    conn
    |> assign(:signed_in, true)
    |> assign(:signed_user, user)
  end

  defp unauthorized(conn) do
    conn |> send_resp(401, "Unauthorized") |> halt()
  end
end
