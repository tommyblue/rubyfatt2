defmodule Rubyfatt2.Customer do
  use Ecto.Schema
  import Ecto.Changeset

  schema "customers" do
    belongs_to :user, Rubyfatt2.User
    has_many :slips, Rubyfatt2.Slip
    has_many :invoice_projects, Rubyfatt2.InvoiceProject
    has_many :invoices, Rubyfatt2.Invoice

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
    |> cast(attrs, [
      :user_id,
      :title,
      :name,
      :surname,
      :address,
      :zip_code,
      :town,
      :province,
      :country,
      :tax_code,
      :vat,
      :info
    ])
    |> validate_required([:title])
    |> unique_constraint(:title, name: :customers_user_id_title_index)
  end

  def full_info(c) do
    "#{c.title}\n#{c.address}\n#{c.zip_code} #{c.town}\nC.F. #{c.tax_code}\nP.IVA #{c.vat}"
  end
end
