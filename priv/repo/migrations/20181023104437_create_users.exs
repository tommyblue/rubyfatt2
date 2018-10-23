defmodule Rubyfatt2.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :title, :string
      add :name, :string
      add :surname, :string
      add :address, :string
      add :zip_code, :string
      add :town, :string
      add :province, :string
      add :tax_code, :string
      add :vat, :string
      add :phone, :string
      add :email, :string, null: false
      add :encrypted_password, :string, null: false
      add :bank_coordinates, :text
      add :language, :string
      add :logo_file_name, :string
      add :logo_content_type, :string
      add :logo_file_size, :bigint
      add :logo_updated_at, :utc_datetime

      timestamps()
    end

    create index(:users, [:email], unique: true)

  end
end
