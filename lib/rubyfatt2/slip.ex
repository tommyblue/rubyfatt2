defmodule Rubyfatt2.Slip do
  use Ecto.Schema
  import Ecto.Changeset


  schema "slips" do
    belongs_to :customer, Rubyfatt2.Customer
    has_one :user, through: [:customer, :user]
    belongs_to :invoice, Rubyfatt2.Invoice
    belongs_to :invoice_project, Rubyfatt2.InvoiceProject

    field :duration, :integer
    field :name, :string
    field :rate, :decimal
    field :timed, :boolean, default: false

    timestamps()
  end

  @doc false
  def changeset(slip, attrs) do
    slip
    |> cast(attrs, [:name, :rate, :timed, :duration])
    |> validate_required([:name, :rate, :timed, :duration])
  end
end
