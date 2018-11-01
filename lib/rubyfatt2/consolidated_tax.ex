defmodule Rubyfatt2.ConsolidatedTax do
  use Ecto.Schema
  import Ecto.Changeset


  schema "consolidated_taxes" do
    belongs_to :user, Rubyfatt2.User
    has_many :taxes, Rubyfatt2.Tax
    has_many :invoices, Rubyfatt2.Invoice
    has_many :invoice_projects, Rubyfatt2.InvoiceProject

    field :name, :string
    field :notes, :string
  end

  @doc false
  def changeset(consolidated_tax, attrs) do
    consolidated_tax
    |> cast(attrs, [:name, :notes])
    |> validate_required([:name, :notes])
    |> unique_constraint(:name)
  end
end
