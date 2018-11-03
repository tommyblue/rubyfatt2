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
  def total(rate, taxes) do
    [compounds, sum] = calculate_tax(taxes, [], rate)
    sum + Enum.sum(compounds)
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
    sum = sum + partial + Enum.sum(compounds)
    [[], sum]
  end

  def get_partial(true, rate, _) do
    rate
  end

  def get_partial(false, rate, sum) do
    sum * rate / 100
  end
end
