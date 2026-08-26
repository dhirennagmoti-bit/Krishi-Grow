# 01 — FRONTEND UI & UX SPECIFICATION
## Agricultural Value-Chain Platform

### 1. Product goal

Build a clean, practical, responsive agricultural value-chain web application for two user types:

1. Farmer
2. Buyer

The product helps farmers manage crop information, discover markets, calculate transportation, check weather, find storage and processing options, discover government schemes, identify value-added products, and connect with buyers.

Buyers can register as:
- Aggregator
- Processor
- Wholesaler

The interface must be **plain, raw, professional, readable and highly functional**.

Do NOT imitate Arva or any other website.

### 2. Visual direction

Use a simple product/SaaS design.

Principles:
- Excellent typography
- Large readable headings
- Clean white or very light background
- Dark charcoal text
- Green as the primary agricultural accent
- Very limited use of other colors
- Clear cards
- Simple borders
- Moderate rounded corners
- Minimal shadows
- No decorative clutter
- No excessive gradients
- No oversized cinematic hero
- No unnecessary animations
- No glassmorphism
- No visual gimmicks

Recommended fonts:
- Headings: Plus Jakarta Sans, Manrope, or DM Sans
- Body/UI: Inter
- Numbers/data: IBM Plex Mono or Inter

Use one primary font family consistently if loading multiple fonts creates unnecessary complexity.

### 3. Global layout

Desktop:
- Left sidebar for dashboard pages
- Top header for account, notifications and search
- Main content area with max-width around 1400px
- 24–32px spacing system

Mobile:
- Top header
- Bottom navigation for primary actions
- Collapsible sections
- Touch-friendly controls

Core colors:
- Background: #F8FAF8
- Surface: #FFFFFF
- Text: #17201A
- Muted text: #68736B
- Primary green: #1F6B45
- Light green: #EAF4ED
- Border: #DCE4DE
- Warning: amber
- Error: red
- Success: green

### 4. Public landing page

Keep it simple.

Header:
- Logo/name
- About
- How It Works
- Farmers
- Buyers
- Market Intelligence
- Login
- Create Account

Hero:
Heading:
"Connect crops to better markets."

Subheading:
"Manage your crop, discover processing opportunities, compare markets, calculate logistics and connect directly with buyers."

Buttons:
- Get Started
- Explore Platform

Below the hero:
- What the platform does
- How it works
- Farmer benefits
- Buyer benefits
- Key platform features
- Simple CTA
- Footer

No large decorative storytelling sections.

### 5. Authentication

Create Account screen:

Step 1:
"How will you use the platform?"

Two large selectable cards:

FARMER
"Manage crops, find opportunities and connect with buyers."

BUYER
"Find agricultural supply and connect with farmers."

Step 2 depends on selection.

Farmer registration:
- Full name
- Mobile
- Email
- Password
- State
- District
- Taluka
- Village
- Farm size
- GPS permission

Buyer registration:
- Business name
- Contact person
- Mobile
- Email
- Password
- State
- District
- Business address
- Buyer type

Buyer type:
- Aggregator
- Processor
- Wholesaler

### 6. Login

Fields:
- Email/mobile
- Password
- Remember me
- Forgot password
- Login

Show clear error messages.

### 7. Farmer dashboard

Sidebar:

- Dashboard
- My Crops
- Add Crop
- Solutions
- Market Prices
- Buyer Connections
- Notifications
- AI Assistant
- Profile
- Logout

Dashboard top:
"Good morning, {name}"

Summary cards:
- Active Crops
- Total Quantity
- Crops Near Shelf-Life Limit
- Buyer Matches

Recent crops table:
- Crop
- Variety
- Quantity
- Grade
- Harvest date
- Remaining shelf life
- Location
- Status
- View

Opportunity section:
"Recommended opportunities for your crops"

### 8. Add Crop

Use a clean multi-step form.

Step 1 — Crop
- Search/select crop
- Crop image appears after selection
- Crop category

Step 2 — Variety
- Select known variety
- Other/custom variety option

Step 3 — Quantity
- Quantity
- Unit: kg/quintal/tonne

Step 4 — Quality
- Grade
- Quality level
- Moisture if applicable
- Size if applicable
- Damage percentage if applicable
- Organic yes/no

Step 5 — Harvest
- Harvest date
- Estimated shelf life
- Storage condition

Step 6 — Location
- Use current GPS
- Manual location fallback
- State/district/taluka/village
- Map preview

Step 7 — Review
Show all information before saving.

Button:
"Add Crop"

After saving:
- Store crop record
- Show crop details
- Trigger recommendation calculation

### 9. Crop detail

Show:
- Crop image
- Crop name
- Variety
- Quantity
- Grade
- Quality
- Harvest date
- Remaining shelf life
- Location

Actions:
- Edit
- Delete
- Find buyers
- Find processing opportunities
- Calculate transport
- View market prices

Add a "Recommended Actions" panel.

### 10. Solutions page

Display six simple solution cards:

1. Transport Calculator
2. Weather
3. Storage & Processing
4. Government Schemes & Subsidies
5. Best Products to Manufacture
6. AI Agricultural Assistant

### 11. Transport calculator

Inputs:
- Crop
- Quantity
- Pickup location
- Destination
- Vehicle type
- Optional preferred transport provider

The UI must display:
- Route distance
- Estimated travel time
- Vehicle capacity
- Transport provider
- Base charge
- Distance charge
- Loading
- Unloading
- Toll charges
- Other charges
- Total transportation cost
- Cost per kg

Allow destination search through map integration.

Show multiple available transport providers when possible.

### 12. Weather

Show:
- Current temperature
- Conditions
- Humidity
- Rain
- Wind
- 7-day forecast

Crop-specific panel:
- Suitable temperature
- Suitable humidity
- Rain sensitivity
- Current risk
- Basic recommendation

Use the farmer's saved location by default.

### 13. Storage and processing

Tabs:
- Storage
- Processing

Storage filters:
- Type
- Distance
- Capacity
- Availability

Storage result:
- Facility name
- Distance
- Capacity
- Available capacity
- Price
- Contact
- Services

Processing results:
- Facility name
- Crops accepted
- Processing types
- Daily capacity
- Distance
- Contact

### 14. Government schemes

Filters:
- State
- Crop
- Farmer/FPO/business
- Processing type
- Investment range

Scheme card:
- Name
- Description
- Eligibility
- Benefit/subsidy
- Required documents
- Application method
- Official source
- Last verified date

### 15. Best products to manufacture

This is the primary recommendation feature.

Input/context:
- Farmer crop
- Variety
- Quantity
- Grade
- Quality
- Location
- Harvest date
- Shelf life

Recommendation result:

Example:
"Tomato → Tomato Puree"

Show:
- Opportunity score
- Market demand
- Investment level
- Estimated margin
- Raw material suitability
- Nearby infrastructure
- Transportation impact
- Shelf-life benefit
- Reason for recommendation

Show 3–5 recommendations ranked by score.

Each recommendation should have:
"Why this was recommended"

### 16. Market prices

Page:
"Market Prices"

Filters:
- Crop
- State
- District
- Market
- Date range

For Maharashtra include urban and rural markets where data exists.

Price table:
- Market
- Crop
- Date
- Min price
- Max price
- Modal price
- Unit

Charts:
- 7-day
- 30-day
- 90-day
- 1-year

Allow comparison between multiple markets.

### 17. Buyer connections

Farmer sees:
- Recommended buyers
- Match score
- Buyer type
- Crop required
- Quantity required
- Distance/region
- Indicative price if available

Button:
"Request Connection"

Exact private information is not shown until a connection is accepted.

### 18. Buyer dashboard

Buyer sidebar:
- Dashboard
- Requirements
- Find Farmers
- Market Prices
- Connections
- Notifications
- AI Assistant
- Profile
- Logout

Dashboard cards:
- Active requirements
- Matching farmers
- New matches
- Pending connections

### 19. Buyer requirements

Buyer can create a requirement:

- Crop
- Variety
- Quantity
- Minimum grade
- Quality requirements
- Price range
- Pickup location
- Required-by date
- Buying frequency
- Notes

Save requirement.

The backend then matches it against farmer crop records.

### 20. Buyer type behavior

Aggregator:
- Collect crops from multiple farmers
- Define collection areas
- Quantity requirements
- Buying frequency

Processor:
- Define processing facility
- Crops required
- Processing capacity
- Minimum batch
- Quality requirements

Wholesaler:
- Define crops required
- Quantity
- Market destination
- Buying frequency
- Quality requirements

### 21. Find farmers

Filters:
- Crop
- Variety
- Grade
- Quantity
- District
- Distance
- Harvest date
- Availability

Farmer cards should show approximate location and crop information.

Do not expose exact private location without permission.

### 22. Matching screen

Example:

"94% Match"

Buyer needs:
20 tonnes tomato

Farmer has:
25 tonnes tomato

Grade:
A

Region:
Nashik

Show matching reasons:
- Crop matches
- Quantity sufficient
- Grade matches
- Location suitable
- Harvest timing suitable

Button:
"Request Connection"

### 23. Connection workflow

1. Buyer sends request
2. Farmer receives notification
3. Farmer accepts/rejects
4. If accepted, both can see approved contact information
5. Messaging/contact actions become available

### 24. AI assistant

Floating button:
"AgriAI"

Chat questions:
- "I have 10 tonnes of onion. What should I do?"
- "Where should I sell my crop?"
- "What products can I manufacture?"
- "Which nearby storage is suitable?"
- "What is the cheapest transport option?"

The assistant should use platform data when available.

### 25. Notifications

Notifications:
- Buyer match
- Connection request
- Connection accepted
- Price movement
- Shelf-life warning
- Weather warning
- Scheme update
- Recommendation update

### 26. Profile

Farmer:
- Personal information
- Farm information
- Location
- Language
- Privacy
- Notification preferences

Buyer:
- Business information
- Buyer type
- Business location
- Contact information
- Requirements
- Verification status

### 27. UX rules

Always:
- Show loading states
- Show empty states
- Show clear validation
- Confirm destructive actions
- Use readable tables
- Provide search and filters
- Preserve entered form data when possible
- Show source/date for market and government information
- Use tooltips for technical terms

Never:
- Hide important information behind unnecessary animations
- Use fake live data without labeling it
- Expose private farmer information
- Use API keys in frontend code

### 28. Responsive behavior

Mobile:
- Single column
- Bottom navigation
- Collapsible filters
- Horizontal scrolling tables only when necessary
- Large form controls
- GPS/map controls accessible with one tap

Tablet:
- Two-column content where useful.

Desktop:
- Sidebar + content
- Tables and charts side-by-side where appropriate.

### 29. Component structure

Recommended React components:

components/
- Navbar
- Sidebar
- Button
- Input
- Select
- Modal
- Card
- DataTable
- ChartCard
- Map
- CropCard
- BuyerCard
- OpportunityCard
- NotificationPanel
- LoadingState
- EmptyState
- ErrorState

pages/
- Landing
- Login
- Register
- FarmerDashboard
- AddCrop
- CropDetails
- Solutions
- Transport
- Weather
- StorageProcessing
- GovernmentSchemes
- ProductRecommendations
- MarketPrices
- BuyerConnections
- BuyerDashboard
- BuyerRequirements
- FindFarmers
- Profile

### 30. Frontend API boundary

The frontend must communicate with Spring Boot through REST APIs.

Never put business rules such as final opportunity scoring, pricing, toll calculation, or buyer matching only in React.

The frontend displays results produced by the backend.
