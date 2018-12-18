defmodule Rubyfatt2Web.Api.V1.InvoicesController do
  use Rubyfatt2Web, :controller
  import Ecto.Query, only: [from: 2]

  alias Rubyfatt2.Customer
  alias Rubyfatt2.Invoice
  alias Rubyfatt2.Slip
  alias Rubyfatt2.Repo

  def index(conn, params) do
    query = from i in Invoice,
            join: c in Customer, on: i.customer_id == c.id
              and i.customer_id == ^params["customers_id"]
              and c.user_id == ^conn.assigns.signed_user.id,
            join: s in Slip, on: i.id == s.invoice_id,
            preload: [:consolidated_tax, :slips],
            group_by: i.id,
            order_by: i.date,
            select_merge: %{rate: sum(s.rate)}

    invoices = Repo.all(query)
    render conn, "index.json", invoices: invoices
  end

  def delete(conn, %{"customers_id" => customer_id, "id" => invoice_id}) do
    invoice = get_invoice(conn.assigns.signed_user.id, customer_id, invoice_id)
    Repo.delete!(invoice)
    conn
    |> send_resp(204, "")
  end

  def print(conn, %{"customers_id" => customer_id, "invoices_id" => invoice_id}) do
    invoice = get_invoice(conn.assigns.signed_user.id, customer_id, invoice_id)

    url = Rubyfatt2.Print.Generator.pdf(invoice, "Ricevuta")
    render conn, "print.json", url: url
  end

  defp get_invoice(user_id, customer_id, invoice_id) do
    query = from i in Invoice,
            join: c in Customer, on: i.customer_id == c.id
            and i.customer_id == ^customer_id
            and c.user_id == ^user_id
            and i.id == ^invoice_id,
            preload: [:customer, :slips, :user, :consolidated_tax]
    Repo.one!(query)
  end
end
