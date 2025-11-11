// backend/src/adapters/inbound/http/banking.router.ts
import { Router, Request, Response, NextFunction } from 'express';
import { IBankingRepository } from '../../../core/ports/banking.repository';
import { IComplianceRepository } from '../../../core/ports/compliance.repository';
import { BankSurplusUseCase } from '../../../core/application/bankSurplus.usecase';
import { ApplyBankedSurplusUseCase } from '../../../core/application/applyBankedSurplus.usecase';

export class BankingRouter {
  public router: Router;
  private bankSurplusUseCase: BankSurplusUseCase;
  private applyBankedSurplusUseCase: ApplyBankedSurplusUseCase;

  constructor(
    private readonly bankingRepository: IBankingRepository,
    private readonly complianceRepository: IComplianceRepository
  ) {
    this.router = Router();
    this.bankSurplusUseCase = new BankSurplusUseCase(bankingRepository, complianceRepository);
    this.applyBankedSurplusUseCase = new ApplyBankedSurplusUseCase(
      bankingRepository,
      complianceRepository
    );
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // POST /banking/bank - Bank surplus
    this.router.post('/bank', this.bankSurplus.bind(this));

    // POST /banking/apply - Apply banked surplus to deficit
    this.router.post('/apply', this.applyBankedSurplus.bind(this));

    // GET /banking/ship/:shipId - Get all banking records for a ship
    this.router.get('/ship/:shipId', this.getByShip.bind(this));

    // GET /banking/ship/:shipId/total - Get total banked amount
    this.router.get('/ship/:shipId/total', this.getTotalBanked.bind(this));
  }

  private async bankSurplus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { shipId, year } = req.body;

      if (!shipId || !year) {
        res.status(400).json({
          success: false,
          message: 'shipId and year are required',
        });
        return;
      }

      const result = await this.bankSurplusUseCase.execute(shipId, parseInt(year));

      res.json({
        success: true,
        data: result,
        message: 'Surplus banked successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  private async applyBankedSurplus(
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

      const result = await this.applyBankedSurplusUseCase.execute(shipId, parseInt(year));

      res.json({
        success: true,
        data: result,
        message: 'Banked surplus applied successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  private async getByShip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { shipId } = req.params;
      const bankingRecords = await this.bankingRepository.findActiveByShip(shipId);

      res.json({
        success: true,
        data: bankingRecords,
        count: bankingRecords.length,
      });
    } catch (error) {
      next(error);
    }
  }

  private async getTotalBanked(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { shipId } = req.params;
      const total = await this.bankingRepository.getTotalBanked(shipId);

      res.json({
        success: true,
        data: {
          shipId,
          totalBanked: total,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
