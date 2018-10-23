defmodule Rubyfatt2Web.Api.V1.UsersView do
  use Rubyfatt2Web, :view

  def render("index.json", %{users: users}) do
    %{data: render_many(users, __MODULE__, "user.json", as: :user)}
  end

  def render("user.json", %{user: user}) do
    %{
      id: user.id,
      email: user.email,
      bank_coordinates: user.bank_coordinates,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }
  end
end
