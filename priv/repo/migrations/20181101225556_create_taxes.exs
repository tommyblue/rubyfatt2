defmodule Rubyfatt2.Repo.Migrations.CreateTaxes do
  use Ecto.Migration

  def change do
    create table(:taxes) do
      add :name, :string
      add :rate, :integer
      add :fixed_rate, :boolean, default: false, null: false
      add :compound, :boolean, default: false, null: false
      add :withholding, :boolean, default: false, null: false
      add :consolidated_tax_id, references(:consolidated_taxes, on_delete: :nothing)
    end

    create unique_index(:taxes, [:name, :consolidated_tax_id])
    create index(:taxes, [:consolidated_tax_id])
  end
end
