# 03 — API, DATABASE & DEPLOYMENT SPECIFICATION
## Agricultural Value-Chain Platform

### 1. Purpose

This file defines:
- SQL database
- external APIs
- API key management
- environment variables
- frontend/backend integration
- Railway deployment
- security
- data updates
- production configuration

### 2. Recommended database

Use PostgreSQL.

Recommended logical database:

agri_value_chain

### 3. Core SQL tables

users
farmer_profiles
buyer_profiles
crops
crop_varieties
crop_grades
farmer_crops
markets
market_prices
processing_products
processing_facilities
processing_facility_crops
storage_facilities
transport_providers
vehicles
government_schemes
buyer_requirements
connections
notifications
ai_conversations
ai_messages
audit_logs

### 4. Main relationships

users
1 → 1 farmer_profiles

users
1 → 1 buyer_profiles

crops
1 → many crop_varieties

crops
1 → many crop_grades

farmers
1 → many farmer_crops

crops
1 → many farmer_crops

markets
1 → many market_prices

crops
1 → many market_prices

crops
1 → many processing_products

processing_facilities
1 → many processing_facility_crops

buyers
1 → many buyer_requirements

farmer_crops ↔ buyer_requirements
through matching/connection logic

users
1 → many notifications

### 5. SQL conventions

Use:
- BIGINT or UUID primary keys
- created_at
- updated_at
- foreign keys
- indexes for frequently searched fields
- unique constraints where required

Important indexes:
- users.email
- users.phone
- farmer_crops.farmer_id
- farmer_crops.crop_id
- farmer_crops.district
- farmer_crops.state
- market_prices.crop_id
- market_prices.market_id
- market_prices.date
- buyer_requirements.crop_id
- buyer_requirements.district
- connections.status

### 6. Data normalization

Always normalize quantity internally.

Supported UI units:
- kg
- quintal
- tonne

Internal storage:
quantity_kg

Conversions:
1 quintal = 100 kg
1 tonne = 1000 kg

Store the original unit only if useful for display/audit.

### 7. Crop master data

Seed the database with crops.

Initial examples:
- Onion
- Tomato
- Wheat
- Rice
- Maize
- Soybean
- Cotton
- Grapes
- Pomegranate
- Banana
- Mango
- Potato
- Sugarcane
- Turmeric
- Chilli
- Groundnut

Each crop should have:
- name
- image
- category
- default shelf-life estimate
- description

Do not use copyrighted images without permission.

Use properly licensed images or self-created assets.

### 8. Crop processing data

Example structure:

Tomato:
- Puree
- Sauce
- Ketchup
- Dehydrated tomato
- Tomato powder

Onion:
- Dehydrated onion
- Onion powder
- Onion flakes
- Fried onion

Mango:
- Pulp
- Juice
- Dried mango
- Pickle
- Powder

Potato:
- Chips
- Fries
- Flakes
- Starch

The data should be treated as opportunity/reference data, not guaranteed profitability.

### 9. Market data

For Maharashtra, create market records covering urban and rural agricultural markets where reliable data is available.

Examples:
- Lasalgaon
- Nashik
- Pune
- Mumbai
- Nagpur
- Sangli
- Kolhapur
- Jalgaon
- Solapur
- Ahmednagar
- Chhatrapati Sambhajinagar

Do not invent current prices.

For demo mode, clearly label records:
"DEMO DATA"

For production, ingest verified data from an appropriate official or licensed source.

Store:
- source
- source URL
- date collected
- import timestamp

### 10. Market update process

Pipeline:

External source
→ MarketDataClient
→ Validation
→ Unit normalization
→ Duplicate check
→ PostgreSQL
→ Market dashboard

Keep import logs.

ImportLog:
- id
- source
- startedAt
- completedAt
- recordsRead
- recordsInserted
- recordsUpdated
- recordsRejected
- status
- errorMessage

### 11. Maps / routing API

Use a routing/map provider that supports:
- geocoding
- reverse geocoding
- route distance
- route duration
- toll information if available

The provider can be selected during implementation.

Possible architecture:

Frontend map
→ Spring Boot
→ Map provider

Do not expose secret server-side keys.

If a browser-restricted public map key is required, use a separate restricted public key with domain restrictions.

### 12. Map functionality

Required:
- current farmer location
- pickup location
- destination
- route
- distance
- travel time
- nearby transport providers
- nearby storage
- nearby processing facilities
- nearby markets

For exact route/toll calculations, use the provider's routing service.

If toll information is unavailable:
return:
"Toll estimate unavailable from current route provider."

Do not silently guess.

### 13. Weather API

Required:
- current weather
- hourly forecast where useful
- daily forecast
- humidity
- rainfall
- wind
- temperature

Backend stores API key.

Frontend calls:
GET /api/v1/weather/current
GET /api/v1/weather/forecast

The backend can cache weather responses to reduce API usage.

Cache key:
latitude + longitude + date/time window

### 14. AI API

Use an AI provider through the backend.

Environment variable:
AI_API_KEY

Frontend:
POST /api/v1/ai/chat

Backend:
- authenticates user
- validates request
- retrieves relevant platform data
- builds context
- calls AI
- returns answer

Never send:
- database credentials
- API secrets
- private unrelated farmer data

### 15. AI prompt context

The AI should be grounded in platform data.

For a farmer question, relevant context may include:
- crop
- quantity
- quality
- location region
- market prices
- nearby processing
- nearby storage
- buyer requirements
- transport estimate

If data is unavailable, the AI should say so.

It must not invent:
- prices
- buyers
- subsidies
- facilities
- weather
- government scheme eligibility

### 16. Environment variables

Backend:

SPRING_PROFILES_ACTIVE=prod

DATABASE_URL=
DATABASE_USERNAME=
DATABASE_PASSWORD=

JWT_SECRET=
JWT_EXPIRATION=

MAPS_API_KEY=
WEATHER_API_KEY=
AI_API_KEY=

CORS_ALLOWED_ORIGINS=

OPTIONAL:
MAIL_HOST=
MAIL_USERNAME=
MAIL_PASSWORD=

Never commit these values to GitHub.

### 17. Local development

Use .env or IDE environment variables.

Example .env:

DATABASE_URL=jdbc:postgresql://localhost:5432/agri_value_chain
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=change_me

MAPS_API_KEY=change_me
WEATHER_API_KEY=change_me
AI_API_KEY=change_me
JWT_SECRET=change_me

Do not commit .env.

Add:
.env
to .gitignore.

### 18. Frontend environment

Only put public/non-secret configuration in frontend environment variables.

Example:
VITE_API_BASE_URL=

Do not put:
- database password
- JWT signing secret
- server API keys
- private provider credentials

### 19. Railway deployment

Recommended:

GitHub
→ Railway

Services:

1. Spring Boot backend
2. PostgreSQL database

Optional:
3. Redis for caching
4. Separate frontend deployment

### 20. Railway backend

Configure:
- Java version
- build command
- start command
- environment variables
- health check

Spring Boot should expose:
GET /actuator/health

Use Spring Boot Actuator.

### 21. Railway PostgreSQL

Create PostgreSQL service.

Use Railway-provided connection variables where supported.

Configure Spring datasource from environment variables.

Never hardcode production credentials.

### 22. Database migrations

Use Flyway.

Recommended:
src/main/resources/db/migration/

Examples:
V1__create_users.sql
V2__create_crop_tables.sql
V3__create_market_tables.sql
V4__create_buyer_tables.sql
V5__create_connection_tables.sql

Do not rely on Hibernate auto-creating production schema.

### 23. Production CORS

Allow only the actual frontend domain.

Example:
https://your-frontend-domain.com

Do not use:
*

in production.

### 24. Security checklist

Before deployment:
- JWT secret is strong
- HTTPS enabled
- Passwords hashed
- CORS restricted
- API keys hidden
- Admin endpoints protected
- Input validation enabled
- Rate limits for authentication/AI endpoints
- SQL injection protection
- Error responses do not expose stack traces
- Private GPS information protected
- Database backups enabled

### 25. Farmer location privacy

Store:
latitude
longitude

But do not show exact coordinates to buyers before connection approval.

For public matching:
- show district
- approximate distance
- approximate region

Exact location only after permission/accepted connection.

### 26. API response format

Use a consistent structure.

Success:

{
  "success": true,
  "data": {...},
  "message": "Crop added successfully"
}

Error:

{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Quantity must be greater than zero"
  }
}

### 27. API documentation

Use OpenAPI/Swagger.

Document:
- authentication
- farmer APIs
- buyer APIs
- crop APIs
- market APIs
- transport APIs
- weather APIs
- storage APIs
- processing APIs
- schemes APIs
- recommendation APIs
- AI APIs

Do not expose production secrets through Swagger.

### 28. API key strategy

Development:
- environment variables

Production:
- Railway environment variables/secrets

Never:
- hardcode in Java source
- hardcode in React
- commit to GitHub
- put inside SQL
- place in screenshots or documentation

### 29. Suggested external integration layer

Create:

integration/
- maps/
- weather/
- ai/
- market/

Example:

MapsClient
WeatherClient
AIClient
MarketDataClient

Services use interfaces so providers can be replaced later.

### 30. Caching

Cache:
- weather
- crop master data
- market metadata
- static facility information where appropriate

Do not cache sensitive personalized data without a clear reason.

### 31. Observability

Log:
- API request failures
- external API failures
- market import failures
- authentication failures
- important admin changes

Do not log:
- passwords
- API keys
- JWT secrets
- unnecessary private user information

### 32. Backup

Production database:
- automated backups
- retention policy
- periodic restore test

### 33. Recommended implementation order

1. PostgreSQL
2. Spring Boot project
3. Flyway
4. User/authentication
5. Farmer profile
6. Buyer profile
7. Crop master
8. Farmer crop CRUD
9. Market database
10. Market prices
11. Transport
12. Weather
13. Storage
14. Processing
15. Government schemes
16. Recommendation engine
17. Buyer requirements
18. Matching
19. Connections
20. Notifications
21. AI
22. Admin
23. Testing
24. Railway deployment

### 34. Final integration

Architecture:

React frontend
        ↓
REST API
        ↓
Spring Boot
        ↓
Services
        ↓
PostgreSQL

External services:

Spring Boot
 ├── Maps/Routing
 ├── Weather
 ├── AI
 └── Market Data

Railway:
 ├── Backend
 └── PostgreSQL

### 35. Important production rule

The application must distinguish between:

REAL VERIFIED DATA
DEMO DATA
ESTIMATED DATA
AI-GENERATED ADVICE

Every market price, government scheme, transport estimate, weather result and recommendation should have appropriate source/estimate labeling where relevant.

The goal is a trustworthy agricultural platform, not a demo that merely looks convincing.
