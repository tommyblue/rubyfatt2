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
    [compounds, sum] = calculate_tax(taxes, [], rate)
    Decimal.add(sum, sum_compounds(compounds))
  end

  def calculate_tax([tax|taxes], compounds, sum) do
    partial = get_partial(tax.fixed_rate, tax.rate, sum)

    [compounds, sum] = get_compounds(tax.compound, partial, compounds, sum)
    calculate_tax(taxes, compounds, sum)
  end

  def calculate_tax([], compounds, sum) do
    [compounds, sum]
  end

  def get_compounds(true, partial, compounds, sum) do
    [compounds ++ [partial], sum]
  end

  def get_compounds(false, partial, compounds, sum) do
    sum = Decimal.add(Decimal.add(sum, partial), sum_compounds(compounds))
    [[], sum]
  end

  def get_partial(true, rate, _) do
    rate
  end

  def get_partial(false, rate, sum) do
    Decimal.div(Decimal.mult(sum, Decimal.new(rate)), Decimal.new(100))
  end

  def sum_compounds([]) do
    Decimal.new(0)
  end

  def sum_compounds(compounds) do
    Enum.reduce(compounds, fn x, acc -> Decimal.add(x, acc) end)
  end
end
