import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { DepartmentsModule } from './departments/departments.module';
import { AssetsModule } from './assets/assets.module';
import { HardwareComponentsModule } from './hardware-components/hardware-components.module';
import { SoftwareModule } from './software/software.module';
import { InstalledSoftwareModule } from './installed-software/installed-software.module';
import { LicensesModule } from './licenses/licenses.module';
import { LicenseAssignmentsModule } from './license-assignments/license-assignments.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { IncidentsModule } from './incidents/incidents.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RolesModule,
    DepartmentsModule,
    AssetsModule,
    HardwareComponentsModule,
    SoftwareModule,
    InstalledSoftwareModule,
    LicensesModule,
    LicenseAssignmentsModule,
    MaintenanceModule,
    IncidentsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
