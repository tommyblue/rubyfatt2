defmodule Rubyfatt2Web.Api.V1.InvoiceProjectsController do
  use Rubyfatt2Web, :controller
  import Ecto.Query, only: [from: 2]

  alias Rubyfatt2.Customer
  alias Rubyfatt2.InvoiceProject
  alias Rubyfatt2.Slip
  alias Rubyfatt2.Repo

  def index(conn, params) do
    query = from ip in InvoiceProject,
            join: c in Customer, on: ip.customer_id == c.id
              and ip.customer_id == ^params["customers_id"]
              and c.user_id == ^conn.assigns.signed_user.id,
            join: s in Slip, on: ip.id == s.invoice_project_id,
            preload: [:consolidated_tax, :slips],
            group_by: ip.id,
            order_by: ip.date,
            select_merge: %{rate: sum(s.rate)}

    invoice_projects = Repo.all(query)
    render conn, "index.json", invoice_projects: invoice_projects
  end

  def delete(conn, %{"customers_id" => customer_id, "id" => invoice_project_id}) do
    invoice_project = get_invoice_project(conn.assigns.signed_user.id, customer_id, invoice_project_id)
    Repo.delete!(invoice_project)
    conn
    |> send_resp(204, "")
  end

  def print(conn, %{"customers_id" => customer_id, "invoice_projects_id" => invoice_project_id}) do
    invoice = get_invoice_project(conn.assigns.signed_user.id, customer_id, invoice_project_id)

    url = Rubyfatt2.Print.Generator.pdf(invoice, "Progetto di notula")
    render conn, "print.json", url: url
  end

  defp get_invoice_project(user_id, customer_id, invoice_project_id) do
    query = from s in InvoiceProject,
            join: c in Customer, on: s.customer_id == c.id
            and s.customer_id == ^customer_id
            and c.user_id == ^user_id
            and s.id == ^invoice_project_id,
            preload: [:customer, :slips, :user, :consolidated_tax]
      Repo.one!(query)
  end
end
