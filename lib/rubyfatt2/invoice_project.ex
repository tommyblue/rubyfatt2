defmodule Rubyfatt2.InvoiceProject do
  use Ecto.Schema
  import Ecto.Changeset


  schema "invoice_projects" do
    belongs_to :customer, Rubyfatt2.Customer
    has_one :user, through: [:customer, :user]
    belongs_to :consolidated_tax, Rubyfatt2.ConsolidatedTax
    has_many :slips, Rubyfatt2.Slip
    has_one :invoice, Rubyfatt2.Invoice

    field :date, :date
    field :downloaded, :boolean, default: false
    field :invoiced, :boolean, default: false
    field :number, :integer

    timestamps()
  end

  @doc false
  def changeset(invoice_project, attrs) do
    invoice_project
    |> cast(attrs, [:date, :number, :invoiced, :downloaded])
    |> validate_required([:date, :number, :invoiced, :downloaded])
  end
end
