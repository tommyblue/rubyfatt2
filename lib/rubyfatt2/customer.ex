defmodule Rubyfatt2.Customer do
  use Ecto.Schema
  import Ecto.Changeset

  schema "customers" do
    belongs_to :user, Rubyfatt2.User

    field :title, :string
    field :name, :string
    field :surname, :string
    field :address, :string
    field :zip_code, :string
    field :town, :string
    field :province, :string
    field :country, :string
    field :tax_code, :string
    field :vat, :string
    field :info, :string

    timestamps()
  end

  def changeset(customer, attrs) do
    customer
    |> cast(attrs, [:title])
    |> unique_constraint([:title, :user_id])
  end
end
