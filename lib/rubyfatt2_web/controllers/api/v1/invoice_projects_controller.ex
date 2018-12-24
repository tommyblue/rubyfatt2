defmodule Rubyfatt2Web.Api.V1.InvoiceProjectsController do
  use Rubyfatt2Web, :controller
  import Ecto.Query, only: [from: 2]

  alias Rubyfatt2.Customer
  alias Rubyfatt2.InvoiceProject
  alias Rubyfatt2.Slip
  alias Rubyfatt2.Repo
  alias Rubyfatt2Web.Api.V1.ChangesetView

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

  def create(conn, %{"customers_id" => customer_id, "invoice_project" => invoice_project_raw_params}) do
    customer = Repo.get_by!(Customer, [id: customer_id, user_id: conn.assigns.signed_user.id])
    invoice_project_params = %{
      "customer_id" => customer.id,
      "date" => invoice_project_raw_params["date"],
      "consolidated_tax_id" => invoice_project_raw_params["consolidated_tax_id"],
      "slips" => invoice_project_raw_params["slips"],
    }
    case InvoiceProject.create(invoice_project_params) do
      {:ok, invoice_project} ->
        conn
        |> put_status(:created)
        |> render("show.json", invoice_project: get_full_invoice_project(invoice_project.id))
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"customers_id" => customer_id, "id" => invoice_project_id}) do
    invoice_project = get_invoice_project(conn.assigns.signed_user.id, customer_id, invoice_project_id)
    Repo.delete!(invoice_project)
    conn
    |> send_resp(204, "")
  end

  def print(conn, %{"customers_id" => customer_id, "invoice_projects_id" => invoice_project_id}) do
    invoice = get_invoice_project(conn.assigns.signed_user.id, customer_id, invoice_project_id)

    url = Rubyfatt2.Print.Generator.pdf(invoice, false)

    # Set the invoice project as downloaded
    invoice_project = Repo.get!(InvoiceProject, invoice_project_id)
    invoice_project = Ecto.Changeset.change(invoice_project, downloaded: true)
    Repo.update!(invoice_project)

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

  defp get_full_invoice_project(invoice_project_id) do
    query = from ip in InvoiceProject,
            join: c in Customer, on: ip.customer_id == c.id,
            join: s in Slip, on: ip.id == s.invoice_project_id,
            where: ip.id == ^invoice_project_id,
            preload: [:customer, :slips, :user, :consolidated_tax],
            group_by: ip.id,
            order_by: ip.date,
            select_merge: %{rate: sum(s.rate)}
      Repo.one!(query)
  end
end
