defmodule Rubyfatt2Web.Api.V1.CustomersController do
  use Rubyfatt2Web, :controller

  alias Rubyfatt2.Customer
  alias Rubyfatt2.Repo
  alias Rubyfatt2Web.Api.V1.ChangesetView

  def index(conn, _params) do
    customers = Repo.all(Customer, user_id: conn.assigns.signed_user.id)
    render conn, "index.json", customers: customers
  end

  def create(conn, %{"customer" => customer_params}) do
    customer_params = Map.merge(customer_params, %{"user_id" => conn.assigns.signed_user.id})
    changeset = Customer.changeset(%Customer{}, customer_params)
    case Repo.insert(changeset) do
      {:ok, customer} ->
        conn
        |> put_status(:created)
        |> render("show.json", customer: customer)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ChangesetView, "error.json", changeset: changeset)
    end
  end
end
