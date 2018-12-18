# Calculate final rate of an invoice/invoice_project based on its
# taxes. Taxes are calculated in a loop beginning from the initial rate.
# Basic rule is:
# - compound taxes must be all applied on the same rate, so
#   adiacent compound taxes are accumulated, waiting for the loop
#   to end or a not compound tax
# - not compound taxes must be applied on the rate calculated in the
#   previous step. Having a not compound rate means that all accumulated
#   compound taxes are summed to get a new rate over which calculate
#   the not compound tax
# - Apart from compound, taxes can be fixed rate (like "add $20") or by percentage
defmodule Rubyfatt2.TaxCalculator do
  import Ecto.Query, only: [from: 2]
  alias Rubyfatt2.Repo
  alias Rubyfatt2.Tax

  def total(rate, consolidated_tax) do
    taxes = Repo.all(from t in Tax, where: [consolidated_tax_id: ^consolidated_tax.id], order_by: :id)
    [compounds, sum, _] = calculate_tax(taxes, [], rate, [])
    Decimal.round(Decimal.add(sum, sum_compounds(compounds)), 2)
  end

  def get_taxes_labels(rate, consolidated_tax) do
    taxes = Repo.all(from t in Tax, where: [consolidated_tax_id: ^consolidated_tax.id], order_by: :id)
    [compounds, sum, labels] = calculate_tax(taxes, [], rate, [])
    total = Decimal.add(sum, sum_compounds(compounds))
    labels ++ [%{title: "Totale", value: "#{Decimal.round(total, 2)}€"}]
  end

  def calculate_tax([tax|taxes], compounds, sum, labels) do
    partial = get_partial(tax.fixed_rate, tax.rate, sum)
    [compounds, sum] = get_compounds(tax.compound, partial, compounds, sum)
    partial_labels = [
      %{title: tax.name, value: "#{Decimal.round(partial, 2)}€"}
    ]
    partial_labels = if tax.compound do
      partial_labels
    else
      partial_labels ++ [%{title: "Subtotale", value: "#{Decimal.round(sum, 2)}€"}]
    end

    calculate_tax(taxes, compounds, sum, labels ++ partial_labels)
  end
  def calculate_tax([], compounds, sum, labels) do
    [compounds, sum, labels]
  end

  def get_compounds(true, partial, compounds, sum) do
    [compounds ++ [partial], sum]
  end
  def get_compounds(false, partial, compounds, sum) do
    sum = Decimal.add(Decimal.add(sum, partial), sum_compounds(compounds))
    [[], Decimal.round(sum, 2)]
  end

  def get_partial(true, rate, _) do
    Decimal.round(rate, 2)
  end
  def get_partial(false, rate, sum) do
    Decimal.round(Decimal.div(Decimal.mult(sum, Decimal.round(Decimal.new(rate), 2)), Decimal.new(100)), 2)
  end

  def sum_compounds([]) do
    Decimal.new(0)
  end
  def sum_compounds(compounds) do
    Decimal.round(Enum.reduce(compounds, fn x, acc -> Decimal.add(x, acc) end), 2)
  end
end
