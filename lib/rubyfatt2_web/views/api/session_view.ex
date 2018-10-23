defmodule Rubyfatt2Web.Api.SessionView do
  use Rubyfatt2Web, :view

  def render("show.json", auth_token) do
    %{data: %{token: auth_token.token}}
  end
end
