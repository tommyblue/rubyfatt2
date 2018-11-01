defmodule Rubyfatt2.Repo.Migrations.CreateSlips do
  use Ecto.Migration

  def change do
    create table(:slips) do
      add :name, :string
      add :rate, :decimal
      add :timed, :boolean, default: false, null: false
      add :duration, :integer
      add :customer_id, references(:customers, on_delete: :nothing)
      add :invoice_id, references(:invoices, on_delete: :nothing)
      add :invoice_project_id, references(:invoice_projects, on_delete: :nothing)

      timestamps()
    end

    create index(:slips, [:customer_id])
    create index(:slips, [:invoice_id])
    create index(:slips, [:invoice_project_id])
  end
end
