// backend/src/adapters/inbound/http/routes.router.ts
import { Router, Request, Response, NextFunction } from 'express';
import { IRouteRepository } from '../../../core/ports/route.repository';

export class RoutesRouter {
  public router: Router;

  constructor(private readonly routeRepository: IRouteRepository) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // GET /routes - Get all routes
    this.router.get('/', this.getAllRoutes.bind(this));

    // GET /routes/:id - Get route by ID
    this.router.get('/:id', this.getRouteById.bind(this));

    // POST /routes/:id/baseline - Set route as baseline
    this.router.post('/:id/baseline', this.setBaseline.bind(this));

    // GET /routes/comparison - Get comparison data
    this.router.get('/comparison/data', this.getComparison.bind(this));
  }

  private async getAllRoutes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const routes = await this.routeRepository.getAll();
      res.json({
        success: true,
        data: routes,
        count: routes.length,
      });
    } catch (error) {
      next(error);
    }
  }

  private async getRouteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const route = await this.routeRepository.findById(id);

      if (!route) {
        res.status(404).json({
          success: false,
          message: `Route with ID ${id} not found`,
        });
        return;
      }

      res.json({
        success: true,
        data: route,
      });
    } catch (error) {
      next(error);
    }
  }

  private async setBaseline(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.routeRepository.setBaseline(id);

      res.json({
        success: true,
        message: `Route ${id} set as baseline`,
      });
    } catch (error) {
      next(error);
    }
  }

  private async getComparison(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const comparisonData = await this.routeRepository.getComparisonData();

      res.json({
        success: true,
        data: comparisonData,
      });
    } catch (error) {
      next(error);
    }
  }
}
