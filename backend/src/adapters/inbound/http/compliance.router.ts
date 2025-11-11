// backend/src/adapters/inbound/http/compliance.router.ts
import { Router, Request, Response, NextFunction } from 'express';
import { IComplianceRepository } from '../../../core/ports/compliance.repository';
import { IRouteRepository } from '../../../core/ports/route.repository';
import { ComputeComplianceBalanceUseCase } from '../../../core/application/computeComplianceBalance.usecase';

export class ComplianceRouter {
  public router: Router;
  private computeComplianceUseCase: ComputeComplianceBalanceUseCase;

  constructor(
    private readonly complianceRepository: IComplianceRepository,
    routeRepository: IRouteRepository
  ) {
    this.router = Router();
    this.computeComplianceUseCase = new ComputeComplianceBalanceUseCase(
      routeRepository,
      complianceRepository
    );
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // GET /compliance/ship/:shipId/year/:year - Get compliance by ship and year
    this.router.get('/ship/:shipId/year/:year', this.getByShipAndYear.bind(this));

    // POST /compliance/compute - Compute compliance balance
    this.router.post('/compute', this.computeCompliance.bind(this));

    // GET /compliance/ship/:shipId - Get all compliance records for a ship
    this.router.get('/ship/:shipId', this.getByShip.bind(this));

    // GET /compliance/year/:year - Get all compliance records for a year
    this.router.get('/year/:year', this.getByYear.bind(this));
  }

  private async getByShipAndYear(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { shipId, year } = req.params;
      const compliance = await this.complianceRepository.findByShipAndYear(
        shipId,
        parseInt(year)
      );

      if (!compliance) {
        res.status(404).json({
          success: false,
          message: `Compliance record not found for ship ${shipId} in year ${year}`,
        });
        return;
      }

      res.json({
        success: true,
        data: compliance,
      });
    } catch (error) {
      next(error);
    }
  }

  private async computeCompliance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { shipId, year } = req.body;

      if (!shipId || !year) {
        res.status(400).json({
          success: false,
          message: 'shipId and year are required',
        });
        return;
      }

      const complianceBalance = await this.computeComplianceUseCase.execute(
        shipId,
        parseInt(year)
      );

      res.json({
        success: true,
        data: {
          shipId,
          year: parseInt(year),
          complianceBalance,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  private async getByShip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { shipId } = req.params;
      const compliances = await this.complianceRepository.findByShip(shipId);

      res.json({
        success: true,
        data: compliances,
        count: compliances.length,
      });
    } catch (error) {
      next(error);
    }
  }

  private async getByYear(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { year } = req.params;
      const compliances = await this.complianceRepository.findByYear(parseInt(year));

      res.json({
        success: true,
        data: compliances,
        count: compliances.length,
      });
    } catch (error) {
      next(error);
    }
  }
}
