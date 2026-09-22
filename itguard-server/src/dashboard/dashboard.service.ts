import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prismaService: PrismaService) {}

  async getStats() {
    const [
      totalUsers,
      activeUsers,
      totalAssets,
      assetsByStatus,
      totalLicenses,
      activeLicenses,
      expiredLicenses,
      openIncidents,
      inReviewIncidents,
      resolvedIncidents,
      pendingMaintenance,
      inProcessMaintenance,
      completedMaintenance,
    ] = await Promise.all([
      this.prismaService.user.count(),
      this.prismaService.user.count({ where: { status: 'ACTIVO' } }),
      this.prismaService.asset.count(),
      this.prismaService.asset.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      this.prismaService.license.count(),
      this.prismaService.license.count({ where: { status: 'ACTIVA' } }),
      this.prismaService.license.count({ where: { status: 'VENCIDA' } }),
      this.prismaService.incident.count({ where: { status: 'ABIERTO' } }),
      this.prismaService.incident.count({ where: { status: 'EN_REVISION' } }),
      this.prismaService.incident.count({ where: { status: 'RESUELTO' } }),
      this.prismaService.maintenance.count({ where: { status: 'PENDIENTE' } }),
      this.prismaService.maintenance.count({ where: { status: 'EN_PROCESO' } }),
      this.prismaService.maintenance.count({ where: { status: 'COMPLETADO' } }),
    ]);

    const byStatus: Record<string, number> = {};
    for (const row of assetsByStatus) {
      byStatus[row.status] = row._count.id;
    }

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
      },
      assets: {
        total: totalAssets,
        byStatus,
      },
      licenses: {
        total: totalLicenses,
        active: activeLicenses,
        expired: expiredLicenses,
      },
      incidents: {
        open: openIncidents,
        inReview: inReviewIncidents,
        resolved: resolvedIncidents,
      },
      maintenance: {
        pending: pendingMaintenance,
        inProcess: inProcessMaintenance,
        completed: completedMaintenance,
      },
    };
  }
}
