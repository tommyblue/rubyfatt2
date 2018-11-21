defmodule Rubyfatt2Web.Api.V1.SlipsController do
  use Rubyfatt2Web, :controller
  import Ecto.Query, only: [from: 2]

  alias Rubyfatt2.Customer
  alias Rubyfatt2.Slip
  alias Rubyfatt2.Repo
  alias Rubyfatt2Web.Api.V1.ChangesetView

  def index(conn, params) do
    query = from s in Slip,
            join: c in Customer, on: s.customer_id == c.id
            and s.customer_id == ^params["customers_id"]
            and c.user_id == ^conn.assigns.signed_user.id
    # The "running" params at "true" will return only slips in a working status, i.e. not with an
    # associated invoice or invoice_project
    query = if params["running"] == "true" do
      from [s, c] in query,
      where: is_nil(s.invoice_project_id) and is_nil(s.invoice_id)
    else
      query
    end
    slips = Repo.all(query)
    render conn, "index.json", slips: slips
  end

  def create(conn, %{"customers_id" => customer_id, "slip" => slip_params}) do
    customer = Repo.get_by!(Customer, [id: customer_id, user_id: conn.assigns.signed_user.id])
    slip_params = Map.merge(slip_params, %{"customer_id" => customer.id})
    changeset = Slip.changeset(%Slip{}, slip_params)
    case Repo.insert(changeset) do
      {:ok, slip} ->
        conn
        |> put_status(:created)
        |> render("show.json", slip: slip)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ChangesetView, "error.json", changeset: changeset)
    end
  end

  def update(conn, %{"customers_id" => customer_id, "id" => slip_id, "slip" => slip_params}) do
    slip = get_slip(conn.assigns.signed_user.id, customer_id, slip_id)
    changeset = Slip.changeset(slip, slip_params)

    case Repo.update(changeset) do
      {:ok, slip} ->
        conn
        |> put_status(:ok)
        |> render("show.json", slip: slip)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"customers_id" => customer_id, "id" => slip_id}) do
    slip = get_slip(conn.assigns.signed_user.id, customer_id, slip_id)
    Repo.delete!(slip)
    conn
    |> send_resp(204, "")
  end

  defp get_slip(user_id, customer_id, slip_id) do
    query = from s in Slip,
            join: c in Customer, on: s.customer_id == c.id
            and s.customer_id == ^customer_id
            and c.user_id == ^user_id
            and s.id == ^slip_id
    Repo.one!(query)
  end
end
