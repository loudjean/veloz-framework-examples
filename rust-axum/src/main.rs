use axum::{routing::get, Json, Router};
use serde::Serialize;
use std::env;

#[derive(Serialize)]
struct Response {
    status: String,
    framework: String,
    message: String,
    timestamp: String,
}

#[derive(Serialize)]
struct Health {
    status: String,
}

async fn root() -> Json<Response> {
    Json(Response {
        status: "ok".to_string(),
        framework: "axum".to_string(),
        message: "Hello from Rust Axum on Veloz!".to_string(),
        timestamp: chrono::Utc::now().to_rfc3339(),
    })
}

async fn health() -> Json<Health> {
    Json(Health {
        status: "healthy".to_string(),
    })
}

#[tokio::main]
async fn main() {
    let port = env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let addr = format!("0.0.0.0:{}", port);
    
    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health));

    println!("Server running on {}", addr);
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
