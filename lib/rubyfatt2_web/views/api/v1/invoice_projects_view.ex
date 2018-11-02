defmodule Rubyfatt2Web.Api.V1.InvoiceProjectsView do
  use Rubyfatt2Web, :view

  def render("index.json", %{invoice_projects: invoice_projects}) do
    %{data: render_many(invoice_projects, __MODULE__, "invoice_project.json", as: :invoice_project)}
  end

  def render("invoice_project.json", %{invoice_project: invoice_project}) do
    %{
      id: invoice_project.id,
      date: invoice_project.date,
      number: invoice_project.number,
      invoiced: invoice_project.invoiced,
      downloaded: invoice_project.downloaded,
      consolidated_tax: invoice_project.consolidated_tax.name,
      slips: Enum.map(invoice_project.slips, fn ip -> ip.id end)
    }
  end
end