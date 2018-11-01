defmodule Rubyfatt2.Invoice do
  use Ecto.Schema
  import Ecto.Changeset


  schema "invoices" do
    belongs_to :customer, Rubyfatt2.Customer
    has_one :user, through: [:customer, :user]
    has_many :slips, Rubyfatt2.Slip
    belongs_to :consolidated_tax, Rubyfatt2.ConsolidatedTax
    belongs_to :invoice_project, Rubyfatt2.InvoiceProject

    field :date, :date
    field :downloaded, :boolean, default: false
    field :number, :integer
    field :payment_date, :date

    timestamps()
  end

  @doc false
  def changeset(invoice, attrs) do
    invoice
    |> cast(attrs, [:date, :number, :payment_date, :downloaded])
    |> validate_required([:date, :number, :payment_date, :downloaded])
  end
end
