defmodule Rubyfatt2Web.Api.V1.InvoicesController do
  use Rubyfatt2Web, :controller
  import Ecto.Query, only: [from: 2]

  alias Rubyfatt2.Customer
  alias Rubyfatt2.Invoice
  alias Rubyfatt2.Repo

  def index(conn, params) do
    query = from i in Invoice,
            join: c in Customer, on: i.customer_id == c.id
            and i.customer_id == ^params["customers_id"]
            and c.user_id == ^conn.assigns.signed_user.id,
            preload: [:consolidated_tax, :slips]
    invoices = Repo.all(query)
    render conn, "index.json", invoices: invoices
  end
end
