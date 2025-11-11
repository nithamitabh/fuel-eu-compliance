# FuelEU Maritime Compliance Backend

Backend service for FuelEU Maritime compliance tracking using hexagonal architecture.

## Architecture

This project follows hexagonal (ports & adapters) architecture:

- **Core Domain**: Business entities and logic (zero framework dependencies)
- **Ports**: Repository interfaces
- **Adapters**:
  - Inbound: HTTP (Express routers)
  - Outbound: PostgreSQL (Prisma repositories)
- **Infrastructure**: Server setup and dependency injection

## Prerequisites

- Node.js >= 14.0.0
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your database:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/fueleu_db
   PORT=3000
   NODE_ENV=development
   ```

4. Set up the database:
   ```bash
   # Create database tables
   npm run prisma:migrate
   
   # Seed with sample data
   npm run db:seed
   ```

## Usage

### Development

Start the development server with hot-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production

Build and run in production:
```bash
npm run build
npm start
```

## Testing

### Unit Tests

Run business logic tests (no database required):
```bash
npm test
```

Current coverage:

- ✅ ComputeComplianceBalanceUseCase: 4 tests
- ✅ BankSurplusUseCase: 4 tests
- ✅ ApplyBankedSurplusUseCase: 4 tests
- ✅ CreatePoolUseCase: 5 tests

### Integration Tests

**Note**: Integration tests require a running PostgreSQL database.

1. Set up test database:
   ```bash
   # Create a separate test database
   createdb fueleu_test
   
   # Update DATABASE_URL in .env or create .env.test
   DATABASE_URL=postgresql://username:password@localhost:5432/fueleu_test
   
   # Run migrations
   npm run prisma:migrate
   ```

2. Run integration tests:
   ```bash
   npm test -- integration
   ```

## Database Management

### Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npm run prisma:migrate

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Prisma Studio

View and edit data in the browser:
```bash
npm run prisma:studio
```

### Seed Data

```bash
npm run db:seed
```

This creates 5 sample routes with different vessel types and fuel types.

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Routes

- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get route by ID
- `POST /api/routes/:id/baseline` - Set route as baseline
- `GET /api/routes/comparison/data` - Get baseline vs comparisons

### Compliance

- `GET /api/compliance/ship/:shipId/year/:year` - Get compliance by ship and year
- `POST /api/compliance/compute` - Compute compliance balance
- `GET /api/compliance/ship/:shipId` - Get all compliance for ship
- `GET /api/compliance/year/:year` - Get all compliance for year

### Banking Operations (Article 20)

- `POST /api/banking/bank-surplus` - Bank compliance surplus
- `POST /api/banking/apply-banked` - Apply banked surplus

### Pools (Article 21)

- `POST /api/pools/create` - Create compliance pool

## Project Structure

```text
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── src/
│   ├── core/                  # Business logic (framework-independent)
│   │   ├── domain/            # Entities and constants
│   │   ├── application/       # Use cases
│   │   └── ports/             # Repository interfaces
│   ├── adapters/
│   │   ├── inbound/           # HTTP routers
│   │   └── outbound/          # Prisma repositories
│   ├── infrastructure/        # Server setup and DI
│   └── index.ts               # Entry point
└── package.json
```

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build TypeScript
npm start                # Run production server
npm test                 # Run unit tests
npm test -- integration  # Run integration tests
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm run db:seed          # Seed database
```

## Business Logic

### Compliance Balance Formula

```text
CB = (TARGET_INTENSITY - ghgIntensity) × fuelConsumption × ENERGY_PER_TON
```

Where:

- `TARGET_INTENSITY = 89.3368` gCO₂eq/MJ
- `ENERGY_PER_TON = 41000` MJ/ton

### Banking (Article 20)

- Ships can bank surplus compliance balance for up to **3 years**
- Surplus from earlier years is applied first (FIFO)
- Expired surplus is automatically filtered out

### Pooling (Article 21)

- Multiple ships can form a compliance pool
- Uses greedy allocation algorithm
- Positive balances offset negative balances
- Requires all ships in same reporting year

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.
