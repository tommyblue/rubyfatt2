defmodule Rubyfatt2.Repo.Migrations.CreateInvoiceProjects do
  use Ecto.Migration

  def change do
    create table(:invoice_projects) do
      add :date, :date
      add :number, :integer
      add :invoiced, :boolean, default: false, null: false
      add :downloaded, :boolean, default: false, null: false
      add :consolidated_tax_id, references(:consolidated_taxes, on_delete: :nothing)
      add :customer_id, references(:customers, on_delete: :nothing)

      timestamps()
    end

    create unique_index(:invoice_projects, [:number, :date, :customer_id])
    create index(:invoice_projects, [:consolidated_tax_id])
    create index(:invoice_projects, [:customer_id])
  end
end
