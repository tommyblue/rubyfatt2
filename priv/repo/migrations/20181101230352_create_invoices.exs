defmodule Rubyfatt2.Repo.Migrations.CreateInvoices do
  use Ecto.Migration

  def change do
    create table(:invoices) do
      add :date, :date
      add :number, :integer
      add :payment_date, :date
      add :downloaded, :boolean, default: false, null: false
      add :consolidated_tax_id, references(:consolidated_taxes, on_delete: :nothing)
      add :customer_id, references(:customers, on_delete: :nothing)
      add :invoice_project_id, references(:invoice_projects, on_delete: :nothing)

      timestamps()
    end

    create unique_index(:invoices, [:number, :date, :customer_id])
    create index(:invoices, [:consolidated_tax_id])
    create index(:invoices, [:customer_id])
    create index(:invoices, [:invoice_project_id])
  end
end
