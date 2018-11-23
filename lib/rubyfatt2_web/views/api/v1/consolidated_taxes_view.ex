defmodule Rubyfatt2Web.Api.V1.ConsolidatedTaxesView do
  use Rubyfatt2Web, :view

  def render("index.json", %{consolidated_taxes: consolidated_taxes}) do
    %{data: render_many(consolidated_taxes, __MODULE__, "consolidated_tax.json", as: :consolidated_tax)}
  end

  def render("consolidated_tax.json", %{consolidated_tax: consolidated_tax}) do
    %{
      id: consolidated_tax.id,
      name: consolidated_tax.name,
      notes: consolidated_tax.notes,
    }
  end
end
