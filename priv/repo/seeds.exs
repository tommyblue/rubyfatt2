# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Rubyfatt2.Repo.insert!(%Rubyfatt2.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

changeset = Rubyfatt2.User.changeset(%Rubyfatt2.User{}, %{
  email: "tommaso.visconti@kreations.it",
  password: "s3cr3t"
})
Rubyfatt2.Repo.insert!(changeset)
