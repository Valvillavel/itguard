import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const databaseUrl = new URL(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port),
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseUrl.pathname.substring(1),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMINISTRADOR_TI' },
    update: {},
    create: {
      name: 'ADMINISTRADOR_TI',
      description: 'Administrador de Tecnología de la Información',
    },
  });
  await prisma.role.upsert({
    where: { name: 'GERENCIA' },
    update: {},
    create: { name: 'GERENCIA', description: 'Gerencia' },
  });
  await prisma.role.upsert({
    where: { name: 'USUARIO' },
    update: {},
    create: { name: 'USUARIO', description: 'Usuario estándar' },
  });

  // Departamentos
  const tiDept = await prisma.department.upsert({
    where: { name: 'TI' },
    update: {},
    create: { name: 'TI', description: 'Tecnología de la Información' },
  });
  await prisma.department.upsert({
    where: { name: 'ADMINISTRACION' },
    update: {},
    create: { name: 'ADMINISTRACION', description: 'Administración' },
  });
  await prisma.department.upsert({
    where: { name: 'RECURSOS_HUMANOS' },
    update: {},
    create: { name: 'RECURSOS_HUMANOS', description: 'Recursos Humanos' },
  });

  // Usuario administrador — contraseña hasheada con bcrypt
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@itguard.com' },
    update: {},
    create: {
      email: 'admin@itguard.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'ITGuard',
      username: 'admin',
      roleId: adminRole.id,
      departmentId: tiDept.id,
    },
  });

  console.log('✓ Seed completado');
  console.log('  admin@itguard.com / Admin123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
