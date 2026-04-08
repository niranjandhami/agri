use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use sqlx::PgPool;
use uuid::Uuid;
use jsonwebtoken::{encode, decode, Header, Algorithm, Validation, EncodingKey, DecodingKey};
use bcrypt::{hash, verify, DEFAULT_COST};
use std::env;

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub password: String, // hashed
    pub role: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct SignupRequest {
    pub name: String,
    pub email: String,
    pub password: String,
    pub role: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: User,
}

pub fn hash_password(password: &str) -> Result<String, bcrypt::BcryptError> {
    hash(password, DEFAULT_COST)
}

pub fn verify_password(password: &str, hash: &str) -> Result<bool, bcrypt::BcryptError> {
    verify(password, hash)
}

pub fn create_jwt(user_id: Uuid) -> Result<String, Box<dyn std::error::Error>> {
    let secret = env::var("JWT_SECRET")?;
    let secret_key = EncodingKey::from_secret(secret.as_bytes());
    let expiration = Utc::now()
        .checked_add_signed(chrono::Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;
    let claims = Claims {
        sub: user_id.to_string(),
        exp: expiration,
    };
    let token = encode(&Header::default(), &claims, &secret_key)?;
    Ok(token)
}

pub fn validate_jwt(token: &str) -> Result<Claims, Box<dyn std::error::Error>> {
    let secret = env::var("JWT_SECRET")?;
    let secret_key = DecodingKey::from_secret(secret.as_bytes());
    let validation = Validation::new(Algorithm::HS256);
    let claims = decode::<Claims>(token, &secret_key, &validation)?;
    Ok(claims.claims)
}

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
}
