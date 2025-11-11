// backend/src/core/application/computeComplianceBalance.usecase.test.ts
import { ComputeComplianceBalanceUseCase } from './computeComplianceBalance.usecase';
import { IRouteRepository } from '../ports/route.repository';
import { IComplianceRepository } from '../ports/compliance.repository';
import { Route } from '../domain/route.entity';
import { ShipCompliance } from '../domain/shipCompliance.entity';

// Mock repositories
class MockRouteRepository implements IRouteRepository {
  private mockRoutes: Map<string, Route[]> = new Map();

  setMockData(shipId: string, year: number, routes: Route[]) {
    this.mockRoutes.set(`${shipId}-${year}`, routes);
  }

  async findByShipAndYear(shipId: string, year: number): Promise<Route[]> {
    return this.mockRoutes.get(`${shipId}-${year}`) || [];
  }

  async getAll(): Promise<Route[]> { return []; }
  async findById(id: string): Promise<Route | null> { return null; }
  async setBaseline(id: string): Promise<void> { }
  async getComparisonData(): Promise<{ baseline: Route; comparisons: Route[] }> {
    throw new Error('Not implemented');
  }
  async create(route: Route): Promise<Route> { return route; }
  async update(id: string, route: Partial<Route>): Promise<Route> {
    throw new Error('Not implemented');
  }
  async delete(id: string): Promise<void> { }
}

class MockComplianceRepository implements IComplianceRepository {
  private savedCompliance: ShipCompliance | null = null;

  getSavedCompliance(): ShipCompliance | null {
    return this.savedCompliance;
  }

  async save(compliance: ShipCompliance): Promise<ShipCompliance> {
    this.savedCompliance = compliance;
    return compliance;
  }

  async findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null> {
    return null;
  }

  async update(complianceId: string, compliance: Partial<ShipCompliance>): Promise<ShipCompliance> {
    throw new Error('Not implemented');
  }

  async findByShip(shipId: string): Promise<ShipCompliance[]> { return []; }
  async findByYear(year: number): Promise<ShipCompliance[]> { return []; }
  async delete(complianceId: string): Promise<void> { }
}

describe('ComputeComplianceBalanceUseCase', () => {
  let useCase: ComputeComplianceBalanceUseCase;
  let routeRepository: MockRouteRepository;
  let complianceRepository: MockComplianceRepository;

  beforeEach(() => {
    routeRepository = new MockRouteRepository();
    complianceRepository = new MockComplianceRepository();
    useCase = new ComputeComplianceBalanceUseCase(routeRepository, complianceRepository);
  });

  describe('Surplus scenario (CB > 0)', () => {
    it('should calculate positive compliance balance when actual intensity is below target', async () => {
      // Arrange
      const shipId = 'SHIP001';
      const year = 2025;
      const routes: Route[] = [
        {
          routeId: 'R001',
          vesselType: 'Container',
          fuelType: 'LNG',
          year: 2025,
          ghgIntensity: 80.0, // Below target of 89.3368
          fuelConsumption: 100, // tons
          distance: 1000,
          totalEmissions: 8000,
          isBaseline: false,
        },
      ];

      routeRepository.setMockData(shipId, year, routes);

      // Act
      const result = await useCase.execute(shipId, year);

      // Assert
      // CB = (89.3368 - 80.0) * (100 * 41000) = 9.3368 * 4100000 = 38,280,880 MJ
      expect(result).toBeGreaterThan(0);
      expect(result).toBeCloseTo(38280880, 0);

      const saved = complianceRepository.getSavedCompliance();
      expect(saved).not.toBeNull();
      expect(saved?.shipId).toBe(shipId);
      expect(saved?.year).toBe(year);
      expect(saved?.complianceBalance).toBeCloseTo(38280880, 0);
      expect(saved?.status).toBe('surplus');
    });
  });

  describe('Deficit scenario (CB < 0)', () => {
    it('should calculate negative compliance balance when actual intensity is above target', async () => {
      // Arrange
      const shipId = 'SHIP002';
      const year = 2025;
      const routes: Route[] = [
        {
          routeId: 'R002',
          vesselType: 'Tanker',
          fuelType: 'HFO',
          year: 2025,
          ghgIntensity: 95.0, // Above target of 89.3368
          fuelConsumption: 150, // tons
          distance: 1500,
          totalEmissions: 14250,
          isBaseline: false,
        },
      ];

      routeRepository.setMockData(shipId, year, routes);

      // Act
      const result = await useCase.execute(shipId, year);

      // Assert
      // CB = (89.3368 - 95.0) * (150 * 41000) = -5.6632 * 6150000 = -34,828,680 MJ
      expect(result).toBeLessThan(0);
      expect(result).toBeCloseTo(-34828680, 0);

      const saved = complianceRepository.getSavedCompliance();
      expect(saved).not.toBeNull();
      expect(saved?.shipId).toBe(shipId);
      expect(saved?.year).toBe(year);
      expect(saved?.complianceBalance).toBeCloseTo(-34828680, 0);
      expect(saved?.status).toBe('deficit');
    });
  });

  describe('Invalid shipId scenario', () => {
    it('should throw error when no routes found for ship', async () => {
      // Arrange
      const shipId = 'INVALID_SHIP';
      const year = 2025;

      // Act & Assert
      await expect(useCase.execute(shipId, year)).rejects.toThrow(
        `No routes found for ship ${shipId} in year ${year}`
      );
    });
  });

  describe('Multiple routes aggregation', () => {
    it('should aggregate compliance balance across multiple routes', async () => {
      // Arrange
      const shipId = 'SHIP003';
      const year = 2025;
      const routes: Route[] = [
        {
          routeId: 'R003A',
          vesselType: 'Container',
          fuelType: 'LNG',
          year: 2025,
          ghgIntensity: 85.0,
          fuelConsumption: 50,
          distance: 500,
          totalEmissions: 4250,
          isBaseline: false,
        },
        {
          routeId: 'R003B',
          vesselType: 'Container',
          fuelType: 'MDO',
          year: 2025,
          ghgIntensity: 92.0,
          fuelConsumption: 30,
          distance: 300,
          totalEmissions: 2760,
          isBaseline: false,
        },
      ];

      routeRepository.setMockData(shipId, year, routes);

      // Act
      const result = await useCase.execute(shipId, year);

      // Assert
      // Route 1: (89.3368 - 85.0) * (50 * 41000) = 4.3368 * 2050000 = 8,890,440 MJ
      // Route 2: (89.3368 - 92.0) * (30 * 41000) = -2.6632 * 1230000 = -3,275,736 MJ
      // Total: 8,890,440 - 3,275,736 = 5,614,704 MJ
      expect(result).toBeGreaterThan(0);
      expect(result).toBeCloseTo(5614704, 0);

      const saved = complianceRepository.getSavedCompliance();
      expect(saved?.status).toBe('surplus');
    });
  });
});
