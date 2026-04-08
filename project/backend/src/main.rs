use actix_web::{web, App, HttpServer};
use log::info;
use crate::models::AppState;

mod auth;
mod models;
mod routes;
mod marketplace;

use actix_web::{web, App, HttpServer, middleware::Logger};
use dotenv::dotenv;
use sqlx::PgPool;
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPool::connect(&database_url).await.expect("Failed to connect to DB");
    
    log::info!("Starting AgriLink backend at http://localhost:8080");

    let state = web::Data::new(crate::AppState { db: pool });

    HttpServer::new(move || {
        App::new()
            .app_data(state.clone())
            .wrap(Logger::default())
            // Auth routes
            .service(auth::auth_scope())
            // Marketplace routes
            .service(marketplace::marketplace_scope())
            .route("/", web::get().to(|| async {
                "AgriLink Backend - API ready! Auth + Products (/api/products GET/POST)"
            }))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
