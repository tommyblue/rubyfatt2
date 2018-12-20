defmodule Rubyfatt2Web.Api.V1.UsersView do
  use Rubyfatt2Web, :view

  def render("user.json", %{user: user}) do
    %{data: %{
        email: user.email,
        title: user.title,
        name: user.name,
        surname: user.surname,
        address: user.address,
        town: user.town,
        zip_code: user.zip_code,
        province: user.province,
        language: user.language,
        phone: user.phone,
        tax_code: user.tax_code,
        vat: user.vat,
        bank_coordinates: user.bank_coordinates,
      }
    }
  end
end
