// backend/src/adapters/inbound/http/pools.router.ts
import { Router, Request, Response, NextFunction } from 'express';
import { IPoolRepository } from '../../../core/ports/pool.repository';
import { IComplianceRepository } from '../../../core/ports/compliance.repository';
import { CreatePoolUseCase } from '../../../core/application/createPool.usecase';

export class PoolsRouter {
  public router: Router;
  private createPoolUseCase: CreatePoolUseCase;

  constructor(
    private readonly poolRepository: IPoolRepository,
    private readonly complianceRepository: IComplianceRepository
  ) {
    this.router = Router();
    this.createPoolUseCase = new CreatePoolUseCase(poolRepository, complianceRepository);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // POST /pools - Create a new pool
    this.router.post('/', this.createPool.bind(this));

    // GET /pools/:id - Get pool by ID
    this.router.get('/:id', this.getPoolById.bind(this));

    // GET /pools/year/:year - Get all pools for a year
    this.router.get('/year/:year', this.getPoolsByYear.bind(this));

    // GET /pools/ship/:shipId - Get pools for a ship
    this.router.get('/ship/:shipId', this.getPoolsByShip.bind(this));

    // GET /pools/:id/members - Get pool members
    this.router.get('/:id/members', this.getPoolMembers.bind(this));
  }

  private async createPool(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { poolName, year, shipIds } = req.body;

      if (!poolName || !year || !shipIds || !Array.isArray(shipIds)) {
        res.status(400).json({
          success: false,
          message: 'poolName, year, and shipIds (array) are required',
        });
        return;
      }

      const result = await this.createPoolUseCase.execute(poolName, parseInt(year), shipIds);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Pool created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  private async getPoolById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const pool = await this.poolRepository.findById(id);

      if (!pool) {
        res.status(404).json({
          success: false,
          message: `Pool with ID ${id} not found`,
        });
        return;
      }

      res.json({
        success: true,
        data: pool,
      });
    } catch (error) {
      next(error);
    }
  }

  private async getPoolsByYear(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { year } = req.params;
      const pools = await this.poolRepository.findByYear(parseInt(year));

      res.json({
        success: true,
        data: pools,
        count: pools.length,
      });
    } catch (error) {
      next(error);
    }
  }

  private async getPoolsByShip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { shipId } = req.params;
      const pools = await this.poolRepository.findByShip(shipId);

      res.json({
        success: true,
        data: pools,
        count: pools.length,
      });
    } catch (error) {
      next(error);
    }
  }

  private async getPoolMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const members = await this.poolRepository.findMembersByPool(id);

      res.json({
        success: true,
        data: members,
        count: members.length,
      });
    } catch (error) {
      next(error);
    }
  }
}
