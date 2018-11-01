defmodule Rubyfatt2.Repo.Migrations.CreateCustomers do
  use Ecto.Migration

  def change do
    create table(:customers) do
      add :user_id, references(:users)
      add :title, :string, null: false
      add :name, :string
      add :surname, :string
      add :address, :string
      add :zip_code, :string
      add :town, :string
      add :province, :string
      add :country, :string
      add :tax_code, :string
      add :vat, :string
      add :info, :text
      timestamps()
    end
    create index(:customers, [:user_id, :title], unique: true)

  end
end
