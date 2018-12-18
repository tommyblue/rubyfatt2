defmodule Rubyfatt2.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Rubyfatt2.Repo
  alias Rubyfatt2.Services.Authenticator

  schema "users" do
    has_many :auth_tokens, Rubyfatt2.AuthToken
    has_many :customers, Rubyfatt2.Customer
    has_many :consolidated_taxes, Rubyfatt2.ConsolidatedTax

    field :address, :string
    field :bank_coordinates, :string
    field :email, :string
    field :language, :string
    field :logo_content_type, :string
    field :logo_file_name, :string
    field :logo_file_size, :integer
    field :logo_updated_at, :utc_datetime
    field :name, :string
    field :phone, :string
    field :province, :string
    field :surname, :string
    field :tax_code, :string
    field :title, :string
    field :town, :string
    field :vat, :string
    field :zip_code, :string

    field :encrypted_password, :string
    field :password, :string, virtual: true

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:title, :name, :surname, :address, :zip_code, :town, :province, :town, :tax_code, :vat, :phone, :email, :password])
    |> validate_required([:email, :password])
    |> unique_constraint(:email, downcase: true)
    |> put_password_hash()
    # |> validate_format(:email, ~r/@/)
    # |> validate_inclusion(:age, 18..100)
  end

  defp put_password_hash(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: pass}} ->
        put_change(
            changeset,
            :encrypted_password,
            Comeonin.Bcrypt.hashpwsalt(pass)
        )
      _ ->
        changeset
    end
  end

  def sign_in(email, password) do
    case Comeonin.Bcrypt.check_pass(Repo.get_by(Rubyfatt2.User, email: email), password) do
      {:ok, user} ->
        token = Authenticator.generate_token(user)
        Repo.insert(Ecto.build_assoc(user, :auth_tokens, %{token: token}))
      err -> err
    end
  end

  def sign_out(conn) do
    case Authenticator.get_auth_token(conn) do
      {:ok, token} ->
        case Repo.get_by(Rubyfatt2.AuthToken, %{token: token}) do
          nil -> {:error, :not_found}
          auth_token -> Repo.delete(auth_token)
        end
      error -> error
    end
  end

  def full_info(u) do
    "#{u.title}\n#{u.address}\n#{u.zip_code} #{u.town}\nC.F. #{u.tax_code}\nP.IVA #{u.vat}\n#{u.email}\n#{u.phone}"
  end
end
