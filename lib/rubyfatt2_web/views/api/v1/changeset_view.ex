defmodule Rubyfatt2Web.Api.V1.ChangesetView do
  use Rubyfatt2Web, :view

  def render "error.json", %{changeset: changeset} do
    %{errors: Enum.map(changeset.errors, fn {key, reason} ->
        %{key => parse_reason(reason)}
      end)
     }
  end

  def parse_reason({reason, _}) do
    reason
  end

  def parse_reason(msg) do
    msg
  end
end
