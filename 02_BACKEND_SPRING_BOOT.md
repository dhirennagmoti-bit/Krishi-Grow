# 02 — BACKEND SPRING BOOT SPECIFICATION
## Agricultural Value-Chain Platform

### 1. Backend goal

Build a production-oriented REST API using:

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT authentication
- Bean Validation
- Hibernate
- PostgreSQL
- Lombok where useful

The backend owns:
- Authentication
- Authorization
- User profiles
- Crop records
- Crop master data
- Market prices
- Transport calculations
- Weather integration
- Storage/processing facilities
- Government schemes
- Product recommendations
- Buyer requirements
- Farmer-buyer matching
- Connections
- Notifications
- AI integration

### 2. Architecture

Use:

Controller
→ Service
→ Repository
→ Database

External integrations:

Controller
→ Service
→ External API client
→ External provider

Suggested packages:

com.agri.platform
- config
- controller
- dto
- entity
- repository
- service
- service.impl
- security
- exception
- mapper
- integration
- util

### 3. Authentication

Use JWT.

Registration:
POST /api/auth/register

Login:
POST /api/auth/login

Refresh:
POST /api/auth/refresh

Logout:
POST /api/auth/logout

Forgot password:
POST /api/auth/forgot-password

Reset password:
POST /api/auth/reset-password

Roles:
- FARMER
- BUYER
- ADMIN

Buyer types:
- AGGREGATOR
- PROCESSOR
- WHOLESALER

Password:
- Hash with BCrypt
- Never store plaintext passwords

### 4. User entities

User:
- id
- name
- email
- phone
- passwordHash
- role
- enabled
- createdAt
- updatedAt

FarmerProfile:
- id
- userId
- farmSize
- state
- district
- taluka
- village
- latitude
- longitude
- locationPrivacy
- verificationStatus

BuyerProfile:
- id
- userId
- businessName
- buyerType
- gstNumber
- address
- state
- district
- taluka
- latitude
- longitude
- verificationStatus

### 5. Crop master data

Crop:
- id
- name
- category
- imageUrl
- description
- defaultShelfLifeDays
- active

CropVariety:
- id
- cropId
- name
- description
- defaultShelfLifeDays

CropGrade:
- id
- cropId
- gradeCode
- description

ProcessingProduct:
- id
- cropId
- productName
- processingType
- investmentLevel
- estimatedMarginMin
- estimatedMarginMax
- demandLevel
- shelfLifeImprovement
- description

### 6. Farmer crop entity

FarmerCrop:
- id
- farmerId
- cropId
- varietyId
- customVariety
- quantity
- unit
- quantityKg
- qualityLevel
- grade
- moisture
- size
- damagePercentage
- organic
- harvestDate
- shelfLifeDays
- storageCondition
- latitude
- longitude
- state
- district
- taluka
- village
- status
- createdAt
- updatedAt

Status:
- AVAILABLE
- PARTIALLY_SOLD
- SOLD
- PROCESSING
- EXPIRED
- INACTIVE

Calculate quantityKg during save/update.

### 7. Crop APIs

GET /api/crops
GET /api/crops/{id}
GET /api/crops/{id}/varieties
GET /api/crops/{id}/grades
GET /api/crops/{id}/products

POST /api/farmer/crops
GET /api/farmer/crops
GET /api/farmer/crops/{id}
PUT /api/farmer/crops/{id}
DELETE /api/farmer/crops/{id}

### 8. Shelf-life service

Calculate:
daysSinceHarvest
remainingShelfLife
urgency

Example urgency:
- SAFE
- ATTENTION
- URGENT
- EXPIRED

Use crop/variety defaults when farmer has not supplied a custom shelf-life value.

Do not claim scientific precision. Label estimates appropriately.

### 9. Location service

Accept GPS coordinates.

Use reverse geocoding to derive:
- State
- District
- Taluka
- Village

Store coordinates privately.

Public farmer matching should use approximate region or controlled distance calculations.

### 10. Market data

Market:
- id
- name
- state
- district
- taluka
- latitude
- longitude
- marketType
- active

MarketPrice:
- id
- marketId
- cropId
- date
- minPrice
- maxPrice
- modalPrice
- unit
- source
- sourceUrl
- importedAt

APIs:

GET /api/markets
GET /api/markets/{id}
GET /api/market-prices
GET /api/market-prices/history
GET /api/market-prices/compare

Filters:
crop
state
district
market
from
to

Always retain source and date.

### 11. Market data ingestion

Create a scheduled service that can import verified market data.

Suggested structure:
MarketDataImportService
- fetch source
- validate records
- normalize units
- deduplicate
- save
- record import status

Do not hardcode current prices into business logic.

### 12. Transport providers

TransportProvider:
- id
- businessName
- contactName
- phone
- rating
- serviceArea
- latitude
- longitude
- active
- verified

Vehicle:
- id
- providerId
- vehicleType
- registrationNumber
- capacityKg
- baseCharge
- pricePerKm
- active

Keep registration numbers private unless appropriate.

### 13. Transport calculation

Request:

POST /api/transport/calculate

Input:
- pickupLat
- pickupLng
- destinationLat
- destinationLng
- quantityKg
- vehicleId
- loadingCost
- unloadingCost

Backend calls map/routing provider for route distance.

Calculation:

distanceCost = distanceKm × vehicle.pricePerKm

total =
baseCharge
+ distanceCost
+ loadingCost
+ unloadingCost
+ tollCost
+ otherCharges

Return:
- distanceKm
- duration
- vehicleCapacity
- baseCharge
- distanceCost
- tollCost
- loadingCost
- unloadingCost
- otherCharges
- totalCost
- costPerKg
- routeSource

Do not invent toll data. If the map provider does not supply tolls, return an explicit unavailable/estimated state.

### 14. Transport provider search

GET /api/transport/providers

Filters:
- vehicleType
- minimumCapacity
- location
- radiusKm
- availability

Sort by:
- distance
- price
- rating

### 15. Weather

Create WeatherService.

GET /api/weather/current
GET /api/weather/forecast
GET /api/weather/crop-advisory

Use coordinates rather than only city names where possible.

WeatherResponse:
- temperature
- humidity
- rainfall
- windSpeed
- condition
- forecast
- timestamp
- source

Crop advisory should combine weather with crop master information.

Never present AI-generated agricultural advice as a guaranteed prediction.

### 16. Storage facilities

StorageFacility:
- id
- name
- type
- address
- state
- district
- latitude
- longitude
- totalCapacityKg
- availableCapacityKg
- pricePerKg
- services
- contact
- verified
- active

Types:
- COLD_STORAGE
- WAREHOUSE
- DRY_STORAGE
- CONTROLLED_ATMOSPHERE

API:
GET /api/storage
GET /api/storage/{id}

### 17. Processing facilities

ProcessingFacility:
- id
- name
- address
- state
- district
- latitude
- longitude
- dailyCapacityKg
- contact
- verified
- active

ProcessingFacilityCrop:
- id
- facilityId
- cropId
- processingType
- minBatchKg
- maxBatchKg

API:
GET /api/processing/facilities
GET /api/processing/facilities/{id}

### 18. Government schemes

GovernmentScheme:
- id
- name
- description
- state
- targetUser
- eligibleCrops
- eligibleActivities
- subsidyDescription
- maximumBenefit
- eligibility
- requiredDocuments
- applicationMethod
- officialUrl
- source
- lastVerifiedAt
- active

API:
GET /api/schemes
GET /api/schemes/{id}

Never fabricate scheme details.

### 19. Product recommendation engine

Create:

RecommendationService

Inputs:
- crop
- variety
- quantity
- grade
- quality
- harvestDate
- shelfLife
- location

Factors:
1. Market demand
2. Current market prices
3. Historical price trend
4. Raw material suitability
5. Quantity suitability
6. Shelf-life urgency
7. Nearby processing infrastructure
8. Transportation cost
9. Investment level
10. Estimated margin
11. Buyer demand

Return top 3–5 processing/product opportunities.

Example score:

opportunityScore =
marketDemandScore * weight
+ rawMaterialScore * weight
+ infrastructureScore * weight
+ economicsScore * weight
+ logisticsScore * weight
+ shelfLifeScore * weight

Weights must be configurable, not hardcoded throughout the code.

Return an explanation for each score.

### 20. Recommendation API

POST /api/recommendations/products

Response:
- product
- score
- demandLevel
- investmentLevel
- estimatedMargin
- nearbyFacilities
- estimatedLogisticsImpact
- reasons
- warnings

Mark estimates clearly.

### 21. Buyer requirements

BuyerRequirement:
- id
- buyerId
- cropId
- varietyId
- quantityRequiredKg
- minimumGrade
- qualityRequirements
- minPrice
- maxPrice
- pickupLocation
- requiredByDate
- buyingFrequency
- notes
- status
- createdAt

API:
POST /api/buyer/requirements
GET /api/buyer/requirements
PUT /api/buyer/requirements/{id}
DELETE /api/buyer/requirements/{id}

### 22. Farmer-buyer matching

Match based on:
- crop
- variety
- quantity
- grade
- quality
- location
- harvest timing
- price range

Match score should be explainable.

Example:
crop match: 30%
quantity: 20%
grade: 15%
quality: 10%
location: 15%
timing: 10%

Return:
- matchScore
- matchedFields
- unmatchedFields
- distanceKm

### 23. Matching APIs

GET /api/buyer/matches
GET /api/farmer/buyer-matches

POST /api/connections/request

POST /api/connections/{id}/accept
POST /api/connections/{id}/reject

GET /api/connections
DELETE /api/connections/{id}

### 24. Privacy

Before connection acceptance:
- show crop
- approximate location
- quantity
- grade
- buyer/farmer type

After acceptance:
- reveal approved contact information
- enable communication

Never expose:
- exact GPS coordinates
- private phone number
- private email
without appropriate permission.

### 25. Notifications

Notification:
- id
- userId
- type
- title
- message
- read
- createdAt

Types:
- BUYER_MATCH
- CONNECTION_REQUEST
- CONNECTION_ACCEPTED
- PRICE_ALERT
- SHELF_LIFE_ALERT
- WEATHER_ALERT
- SCHEME_UPDATE
- SYSTEM

API:
GET /api/notifications
PUT /api/notifications/{id}/read

### 26. AI assistant

POST /api/ai/chat

Input:
- message
- optional cropId
- optional location
- optional conversationId

The backend should retrieve relevant platform data before sending context to the AI provider.

Example:
Farmer asks:
"I have 10 tonnes of onion."

Backend can retrieve:
- farmer crop
- nearby markets
- current prices
- processing options
- storage
- buyers
- transport

Then provide that context to the AI model.

Never expose secret AI API keys to frontend.

### 27. Admin functions

Admin should manage:
- crops
- varieties
- grades
- markets
- market prices
- processing products
- processing facilities
- storage facilities
- transport providers
- government schemes
- buyers/farmers verification

Protect admin endpoints with ADMIN role.

### 28. Validation

Use Bean Validation:
- @NotNull
- @NotBlank
- @Email
- @Positive
- @PositiveOrZero
- @Size

Validate:
- quantity
- dates
- coordinates
- price
- grade
- user roles

### 29. Error handling

Use global exception handler.

Return:

{
  "timestamp": "...",
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "Quantity must be greater than zero",
  "path": "/api/farmer/crops"
}

Never expose stack traces in production.

### 30. Security

- JWT
- BCrypt
- Role-based authorization
- CORS restricted to frontend origin
- Rate limiting for sensitive endpoints
- Input validation
- SQL injection protection through JPA/parameterized queries
- Secrets through environment variables
- HTTPS in production
- Audit important changes

### 31. Scheduled jobs

Use Spring Scheduler for:
- Market price imports
- Weather cache updates
- Shelf-life alerts
- Buyer matching refresh
- Scheme verification reminders
- Cleanup of expired records where appropriate

### 32. Database transactions

Use @Transactional around:
- registration
- crop creation/update
- connection acceptance
- buyer requirement creation
- matching updates

### 33. API versioning

Prefer:
 /api/v1/...

Example:
 /api/v1/auth/login
 /api/v1/farmer/crops

This makes future API changes safer.

### 34. Backend testing

Unit tests:
- recommendation scoring
- shelf-life calculations
- transport calculations
- matching score
- validation

Integration tests:
- authentication
- crop CRUD
- market search
- buyer requirements
- connections

### 35. Backend principle

The backend must be the source of truth for:
- permissions
- calculations
- recommendations
- matching
- private information
- database state

Never trust values sent by the frontend without validation.
