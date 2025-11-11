// backend/src/infrastructure/server/app.ts
import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';

// Repositories
import { PrismaRouteRepository } from '../../adapters/outbound/postgres/prismaRoute.repository';
import { PrismaComplianceRepository } from '../../adapters/outbound/postgres/prismaCompliance.repository';
import { PrismaBankingRepository } from '../../adapters/outbound/postgres/prismaBanking.repository';
import { PrismaPoolRepository } from '../../adapters/outbound/postgres/prismaPool.repository';

// Routers
import { RoutesRouter } from '../../adapters/inbound/http/routes.router';
import { ComplianceRouter } from '../../adapters/inbound/http/compliance.router';
import { BankingRouter } from '../../adapters/inbound/http/banking.router';
import { PoolsRouter } from '../../adapters/inbound/http/pools.router';

// Middleware
import { ErrorMiddleware } from '../../adapters/inbound/http/error.middleware';

export class App {
  public app: Express;
  private prisma: PrismaClient;

  constructor() {
    this.app = express();
    this.prisma = new PrismaClient();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // CORS middleware (basic setup)
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });
  }

  private setupRoutes(): void {
    // Instantiate repositories
    const routeRepository = new PrismaRouteRepository(this.prisma);
    const complianceRepository = new PrismaComplianceRepository(this.prisma);
    const bankingRepository = new PrismaBankingRepository(this.prisma);
    const poolRepository = new PrismaPoolRepository(this.prisma);

    // Instantiate routers with dependency injection
    const routesRouter = new RoutesRouter(routeRepository);
    const complianceRouter = new ComplianceRouter(complianceRepository, routeRepository);
    const bankingRouter = new BankingRouter(bankingRepository, complianceRepository);
    const poolsRouter = new PoolsRouter(poolRepository, complianceRepository);

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // API routes
    this.app.use('/api/routes', routesRouter.router);
    this.app.use('/api/compliance', complianceRouter.router);
    this.app.use('/api/banking', bankingRouter.router);
    this.app.use('/api/pools', poolsRouter.router);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'FuelEU Maritime Compliance API',
        version: '1.0.0',
        endpoints: {
          routes: '/api/routes',
          compliance: '/api/compliance',
          banking: '/api/banking',
          pools: '/api/pools',
          health: '/health',
        },
      });
    });
  }

  private setupErrorHandling(): void {
    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Endpoint not found',
      });
    });

    // Error handling middleware
    this.app.use(ErrorMiddleware.handle);
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
