defmodule ElixirApp.Router do
  use Plug.Router

  plug :match
  plug :dispatch

  get "/" do
    response = %{
      status: "ok",
      framework: "elixir",
      message: "Hello from Elixir on Veloz!",
      timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
    }
    
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Jason.encode!(response))
  end

  get "/health" do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Jason.encode!(%{status: "healthy"}))
  end

  match _ do
    send_resp(conn, 404, "Not found")
  end
end
