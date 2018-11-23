defmodule Rubyfatt2Web.Api.V1.ConsolidatedTaxesController do
  use Rubyfatt2Web, :controller

  alias Rubyfatt2.Repo
  alias Rubyfatt2.ConsolidatedTax

  def index(conn, _params) do
    consolidated_taxes = Repo.all(ConsolidatedTax, user_id: conn.assigns.signed_user.id)
    render conn, "index.json", consolidated_taxes: consolidated_taxes
  end
end
