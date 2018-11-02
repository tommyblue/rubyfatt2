defmodule Rubyfatt2Web.Api.V1.SlipsController do
  use Rubyfatt2Web, :controller
  import Ecto.Query, only: [from: 2]

  alias Rubyfatt2.Customer
  alias Rubyfatt2.Slip
  alias Rubyfatt2.Repo

  def index(conn, params) do
    query = from s in Rubyfatt2.Slip,
            join: c in Rubyfatt2.Customer, on: s.customer_id == c.id
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
end
