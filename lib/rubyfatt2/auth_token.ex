defmodule Rubyfatt2.AuthToken do
  use Ecto.Schema
  import Ecto.Changeset


  schema "auth_tokens" do
    belongs_to :user, Rubyfatt2.User

    field :revoked, :boolean, default: false
    field :revoked_at, :utc_datetime
    field :token, :string

    timestamps()
  end

  @doc false
  def changeset(%Rubyfatt2.AuthToken{} = auth_token, attrs) do
    auth_token
    |> cast(attrs, [:token])
    |> validate_required([:token])
    |> unique_constraint(:token)
  end
end
