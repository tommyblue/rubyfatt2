defmodule Rubyfatt2Web.PageController do
  use Rubyfatt2Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
