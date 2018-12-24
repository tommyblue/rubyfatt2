defmodule Rubyfatt2.InvoiceProject do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query, only: [from: 2]

  alias Rubyfatt2.Repo
  alias Rubyfatt2.Slip

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

    field :rate, :decimal, virtual: true

    timestamps()
  end

  def create(attrs) do
    # Get number
    year = Date.from_iso8601!(attrs["date"]).year
    number = __MODULE__.get_next_number(year)
    attrs = Map.merge(attrs, %{"number" => number})

    slips = from(s in Slip, where: s.id in ^attrs["slips"]) |> Repo.all

    changeset = %__MODULE__{}
    |> cast(attrs, [:date, :consolidated_tax_id, :customer_id, :number])
    |> put_assoc(:slips, slips)
    |> validate_required([:date, :consolidated_tax_id, :customer_id, :number, :slips])

    Repo.insert(changeset)
  end

  @doc false
  def changeset(invoice_project, attrs) do
    invoice_project
    |> cast(attrs, [:date, :number, :invoiced, :downloaded])
    |> validate_required([:date, :number, :invoiced, :downloaded])
  end

  def get_next_number(year) do
    # Get max number of the year and returns it + 1
    {:ok, start_date} = Date.new(year, 1, 1)
    {:ok, end_date} = Date.new(year, 12, 31)

    query = from ip in __MODULE__,
      select: max(ip.number),
      where: ip.date >= ^Date.to_iso8601(start_date),
      where: ip.date <= ^Date.to_iso8601(end_date)

    case Repo.one(query) do
      nil -> 1
      n -> n+1
    end
  end
end
