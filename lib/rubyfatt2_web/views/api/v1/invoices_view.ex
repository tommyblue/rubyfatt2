defmodule Rubyfatt2Web.Api.V1.InvoicesView do
  use Rubyfatt2Web, :view
  alias Rubyfatt2.TaxCalculator

  def render("index.json", %{invoices: invoices}) do
    %{data: render_many(invoices, __MODULE__, "invoice.json", as: :invoice)}
  end

  def render("invoice.json", %{invoice: invoice}) do
    %{
      id: invoice.id,
      date: invoice.date,
      number: invoice.number,
      payment_date: invoice.payment_date,
      downloaded: invoice.downloaded,
      rate: invoice.rate,
      total: TaxCalculator.total(invoice.rate, invoice.consolidated_tax),
      consolidated_tax: invoice.consolidated_tax.name,
      invoice_project_id: invoice.invoice_project_id,
      slips: Enum.map(invoice.slips, fn i -> i.id end)
    }
  end
end
