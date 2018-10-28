defmodule Rubyfatt2Web.Api.V1.CustomersView do
  use Rubyfatt2Web, :view

  def render("index.json", %{customers: customers}) do
    %{data: render_many(customers, __MODULE__, "customer.json", as: :customer)}
  end

  def render("show.json", %{customer: customer}) do
    %{data: render_one(customer, __MODULE__, "customer.json", as: :customer)}
  end

  def render("customer.json", %{customer: customer}) do
    %{
      id: customer.id,
      title: customer.title,
      name: customer.name,
      surname: customer.surname,
      address: customer.address,
      zip_code: customer.zip_code,
      town: customer.town,
      province: customer.province,
      country: customer.country,
      tax_code: customer.tax_code,
      vat: customer.vat,
      info: customer.info
    }
  end
end
