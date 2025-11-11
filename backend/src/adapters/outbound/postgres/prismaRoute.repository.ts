// backend/src/adapters/outbound/postgres/prismaRoute.repository.ts
import { PrismaClient } from '@prisma/client';
import { IRouteRepository } from '../../../core/ports/route.repository';
import { Route } from '../../../core/domain/route.entity';

export class PrismaRouteRepository implements IRouteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(): Promise<Route[]> {
    const routes = await this.prisma.route.findMany({
      orderBy: { created_at: 'desc' },
    });
    return routes.map(this.toDomain);
  }

  async findById(id: string): Promise<Route | null> {
    const route = await this.prisma.route.findUnique({
      where: { route_id: id },
    });
    return route ? this.toDomain(route) : null;
  }

  async findByShipAndYear(shipId: string, year: number): Promise<Route[]> {
    // Note: The Route entity doesn't have shipId in the schema
    // This would need to be added if needed
    // For now, returning routes by year only
    const routes = await this.prisma.route.findMany({
      where: { year },
    });
    return routes.map(this.toDomain);
  }

  async setBaseline(id: string): Promise<void> {
    // First, unset all baselines for the same year
    const route = await this.prisma.route.findUnique({
      where: { route_id: id },
    });

    if (!route) {
      throw new Error(`Route ${id} not found`);
    }

    await this.prisma.$transaction([
      // Unset all baselines for the same year
      this.prisma.route.updateMany({
        where: { year: route.year },
        data: { is_baseline: false },
      }),
      // Set the new baseline
      this.prisma.route.update({
        where: { route_id: id },
        data: { is_baseline: true },
      }),
    ]);
  }

  async getComparisonData(): Promise<{ baseline: Route; comparisons: Route[] }> {
    const baseline = await this.prisma.route.findFirst({
      where: { is_baseline: true },
      orderBy: { year: 'desc' },
    });

    if (!baseline) {
      throw new Error('No baseline route found');
    }

    const comparisons = await this.prisma.route.findMany({
      where: {
        is_baseline: false,
        year: { gte: baseline.year },
      },
      orderBy: { year: 'asc' },
    });

    return {
      baseline: this.toDomain(baseline),
      comparisons: comparisons.map(this.toDomain),
    };
  }

  async create(route: Route): Promise<Route> {
    const created = await this.prisma.route.create({
      data: {
        route_id: route.routeId,
        vessel_type: route.vesselType,
        fuel_type: route.fuelType,
        year: route.year,
        ghg_intensity: route.ghgIntensity,
        fuel_consumption: route.fuelConsumption,
        distance: route.distance,
        total_emissions: route.totalEmissions,
        is_baseline: route.isBaseline,
      },
    });
    return this.toDomain(created);
  }

  async update(id: string, route: Partial<Route>): Promise<Route> {
    const updated = await this.prisma.route.update({
      where: { route_id: id },
      data: {
        vessel_type: route.vesselType,
        fuel_type: route.fuelType,
        year: route.year,
        ghg_intensity: route.ghgIntensity,
        fuel_consumption: route.fuelConsumption,
        distance: route.distance,
        total_emissions: route.totalEmissions,
        is_baseline: route.isBaseline,
      },
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.route.delete({
      where: { route_id: id },
    });
  }

  private toDomain(prismaRoute: any): Route {
    return {
      routeId: prismaRoute.route_id,
      vesselType: prismaRoute.vessel_type,
      fuelType: prismaRoute.fuel_type,
      year: prismaRoute.year,
      ghgIntensity: prismaRoute.ghg_intensity,
      fuelConsumption: prismaRoute.fuel_consumption,
      distance: prismaRoute.distance,
      totalEmissions: prismaRoute.total_emissions,
      isBaseline: prismaRoute.is_baseline,
    };
  }
}
