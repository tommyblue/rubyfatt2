defmodule Rubyfatt2.Repo.Migrations.CreateConsolidatedTaxes do
  use Ecto.Migration

  def change do
    create table(:consolidated_taxes) do
      add :name, :string
      add :notes, :text
      add :user_id, references(:users, on_delete: :nothing)
    end

    create unique_index(:consolidated_taxes, [:user_id, :name])
    create index(:consolidated_taxes, [:user_id])

  end
end
