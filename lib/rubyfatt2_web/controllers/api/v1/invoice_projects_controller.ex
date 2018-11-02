defmodule Rubyfatt2Web.Api.V1.InvoiceProjectsController do
  use Rubyfatt2Web, :controller
  import Ecto.Query, only: [from: 2]

  alias Rubyfatt2.Customer
  alias Rubyfatt2.InvoiceProject
  alias Rubyfatt2.Repo

  def index(conn, params) do
    query = from ip in InvoiceProject,
            join: c in Customer, on: ip.customer_id == c.id
            and ip.customer_id == ^params["customers_id"]
            and c.user_id == ^conn.assigns.signed_user.id,
            preload: [:consolidated_tax, :slips]

    invoice_projects = Repo.all(query)
    render conn, "index.json", invoice_projects: invoice_projects
  end
end
