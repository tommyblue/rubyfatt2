defmodule Rubyfatt2Web.Api.V1.SlipsView do
  use Rubyfatt2Web, :view

  def render("index.json", %{slips: slips}) do
    %{data: render_many(slips, __MODULE__, "slip.json", as: :slip)}
  end

  def render("show.json", %{slip: slip}) do
    %{data: render_one(slip, __MODULE__, "slip.json", as: :slip)}
  end

  def render("slip.json", %{slip: slip}) do
    %{
      id: slip.id,
      duration: slip.duration,
      name: slip.name,
      rate: slip.rate,
      timed: slip.timed,
      customer_id: slip.customer_id
    }
  end
end
