defmodule Rubyfatt2.Print.Generator do
  alias Rubyfatt2.Customer
  alias Rubyfatt2.User
  alias Rubyfatt2.TaxCalculator

  def pdf(i, is_invoice) do
    api_base = "https://us1.pdfgeneratorapi.com/api/v3"
    template_id = Application.get_env(:rubyfatt2, :pdfgeneratorapi)[:template_id]
    url = "#{api_base}/templates/#{template_id}/output?format=pdf&output=url"

    headers = [
      "Accept": "application/json; charset=utf-8",
      "Content-Type": "application/json; charset=utf-8",
      "X-Auth-Key": Application.get_env(:rubyfatt2, :pdfgeneratorapi)[:key],
      "X-Auth-Secret": Application.get_env(:rubyfatt2, :pdfgeneratorapi)[:secret],
      "X-Auth-Workspace": Application.get_env(:rubyfatt2, :pdfgeneratorapi)[:workspace],
    ]

    total = get_sum(i.slips)
    label = if is_invoice do "Ricevuta" else "Progetto di notula" end
    extra = if is_invoice do "Coordinate Bancarie\n\n#{i.user.bank_coordinates}" else i.consolidated_tax.notes end
    body = %{
      customer: %{
          info: Customer.full_info(i.customer)
      },
      user: %{
          info: User.full_info(i.user)
      },
      invoice: %{
          label: label,
          location: i.user.town,
          date: "#{format_number(i.date.day)}/#{format_number(i.date.month)}/#{i.date.year}",
          number: "#{label} n. #{i.date.year}-#{format_number(i.number, 3)}",
          subtotal: "#{Decimal.round(total, 2)}€",
          total: "#{TaxCalculator.total(total, i.consolidated_tax)}€"
      },
      slips: Enum.map(i.slips, fn s -> %{title: s.name, total: "#{Decimal.round(s.rate, 2)}€"} end),
      taxes: TaxCalculator.get_taxes_labels(total, i.consolidated_tax),
      extra: extra
    }
    {:ok, json_body} = Poison.encode(body)
    {:ok, raw_response} = HTTPoison.post(url, json_body, headers)
    {:ok, response} = Poison.decode(raw_response.body)

    response["response"]
  end

  defp format_number(n, padding \\ 2, leading \\ true) do
    if leading do
      n |> Integer.to_string |> String.pad_leading(padding, "0")
    else
      n |> Integer.to_string |> String.pad_trailing(padding, "0")
    end
  end

  def get_sum([h|t]) do
    Decimal.add(h.rate, get_sum(t))
  end

  def get_sum([]) do
    Decimal.new(0)
  end
end
