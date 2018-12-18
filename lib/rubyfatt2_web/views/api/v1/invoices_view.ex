defmodule Rubyfatt2Web.Api.V1.InvoicesView do
  use Rubyfatt2Web, :view
  alias Rubyfatt2.TaxCalculator
  alias Rubyfatt2Web.Api.V1.SlipsView

  def render("index.json", %{invoices: invoices}) do
    %{data: render_many(invoices, __MODULE__, "invoice.json", as: :invoice)}
  end

  def render("invoice.json", %{invoice: invoice}) do
    %{
      id: invoice.id,
      customer_id: invoice.customer_id,
      date: invoice.date,
      number: invoice.number,
      payment_date: invoice.payment_date,
      downloaded: invoice.downloaded,
      rate: invoice.rate,
      total: TaxCalculator.total(invoice.rate, invoice.consolidated_tax),
      consolidated_tax_id: invoice.consolidated_tax.id,
      invoice_project_id: invoice.invoice_project_id,
      slips: render_many(invoice.slips, SlipsView, "slip.json", as: :slip)
    }
  end

  def render("print.json", %{url: url}) do
    %{data: %{
      url: url
    }}
  end
end
