use actix_web::{post, web::{Data, Json}, HttpResponse, Responder};
use sqlx::{PgPool, Row};
use crate::models::{User, SignupRequest, LoginRequest, AuthResponse, hash_password, verify_password, create_jwt};

pub async fn signup_handler(
    pool: Data<PgPool>,
    body: Json<SignupRequest>,
) -> impl Responder {
    let hashed_pw = match hash_password(&body.password) {
        Ok(hash) => hash,
        Err(_) => return HttpResponse::InternalServerError().json("Hash error"),
    };

    let user = sqlx::query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *"
    )
    .bind(&body.name)
    .bind(&body.email)
    .bind(&hashed_pw)
    .bind(&body.role)
    .fetch_one(pool.get_ref())
    .await;

    match user {
        Ok(new_user) => {
            let token = create_jwt(new_user.id).unwrap_or_default();
            HttpResponse::Created().json(AuthResponse { token, user: new_user })
        }
        Err(sqlx::Error::Database(db_err)) if db_err.message().contains("duplicate key") => {
            HttpResponse::BadRequest().json("Email already exists")
        }
        Err(_) => HttpResponse::InternalServerError().json("Signup failed"),
    }
}

pub async fn login_handler(
    pool: Data<PgPool>,
    body: Json<LoginRequest>,
) -> impl Responder {
    let user_result = sqlx::query_as::<_, User>(
        "SELECT * FROM users WHERE email = $1"
    )
    .bind(&body.email)
    .fetch_optional(pool.get_ref())
    .await;

    match user_result {
        Ok(Some(user)) => {
            let valid = verify_password(&body.password, &user.password).unwrap_or(false);
            if valid {
                let token = create_jwt(user.id).unwrap_or_default();
                HttpResponse::Ok().json(AuthResponse { token, user })
            } else {
                HttpResponse::Unauthorized().json("Invalid credentials")
            }
        }
        _ => HttpResponse::Unauthorized().json("Invalid credentials"),
    }
}

pub fn auth_scope() -> actix_web::Scope {
    web::scope("/api/auth")
        .route("/signup", post(signup_handler))
        .route("/login", post(login_handler))
}
