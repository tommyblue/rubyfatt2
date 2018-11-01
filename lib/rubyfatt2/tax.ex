defmodule Rubyfatt2.Tax do
  use Ecto.Schema
  import Ecto.Changeset


  schema "taxes" do
    belongs_to :consolidated_tax, Rubyfatt2.ConsolidatedTax
    has_one :user, through: [:consolidated_tax, :user]

    field :compound, :boolean, default: false
    field :fixed_rate, :boolean, default: false
    field :name, :string
    field :rate, :integer
    field :withholding, :boolean, default: false
  end

  @doc false
  def changeset(tax, attrs) do
    tax
    |> cast(attrs, [:name, :rate, :fixed_rate, :compound, :withholding])
    |> validate_required([:name, :rate, :fixed_rate, :compound, :withholding])
    |> unique_constraint(:name)
  end
end
