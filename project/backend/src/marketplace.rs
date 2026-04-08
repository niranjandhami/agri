use actix_web::{delete, get, post, put, web::{Data, Json, Path, Query}, HttpRequest, HttpResponse, Responder};
use sqlx::PgPool;
use crate::models::{Product, CreateProductRequest, validate_jwt, Claims, AppState};

pub async fn get_products(pool: Data<PgPool>) -> impl Responder {
    let products = sqlx::query_as::<_, Product>(
        "SELECT * FROM products ORDER BY created_at DESC"
    )
    .fetch_all(pool.get_ref())
    .await
    .unwrap_or(vec![]);

    HttpResponse::Ok().json(products)
}

pub async fn create_product(
    pool: Data<PgPool>,
    req: HttpRequest,
    body: Json<CreateProductRequest>,
) -> impl Responder {
    // Simple auth check from header
    let auth_header = req.headers().get("Authorization");
    let token = auth_header.and_then(|h| h.to_str().ok()).and_then(|h| h.strip_prefix("Bearer "));
    let claims = if let Some(t) = token {
        validate_jwt(t).ok()
    } else {
        None
    };

    if claims.is_none() {
        return HttpResponse::Unauthorized().json("Auth required");
    }

    let farmer_id = uuid::Uuid::parse_str(&claims.unwrap().sub).ok();

    if farmer_id.is_none() {
        return HttpResponse::BadRequest().json("Invalid user");
    }

    let new_product = sqlx::query_as::<_, Product>(
        "INSERT INTO products (farmer_id, name, description, price, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *"
    )
    .bind(farmer_id.unwrap())
    .bind(&body.name)
    .bind(&body.description)
    .bind(body.price)
    .bind(body.quantity)
    .fetch_one(pool.get_ref())
    .await;

    match new_product {
        Ok(product) => HttpResponse::Created().json(product),
        Err(_) => HttpResponse::InternalServerError().json("Create failed"),
    }
}

pub fn marketplace_scope() -> actix_web::Scope {
    web::scope("/api/products")
        .route("", get(get_products))
        .route("", post(create_product))
}
