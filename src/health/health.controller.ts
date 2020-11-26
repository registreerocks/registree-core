import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  DNSHealthIndicator,
  HealthCheck,
  MongooseHealthIndicator,
  HealthIndicatorFunction,
} from '@nestjs/terminus';
import { AppConfigService } from 'src/app-config/app-config.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly dns: DNSHealthIndicator,
    private readonly config: AppConfigService,
    private readonly mongo: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.mongo.pingCheck('mongodb-core', { timeout: 1500 }),
      () =>
        this.dns.pingCheck(
          'auth0-management-api',
          new URL(this.config.createAuth0DataOptions().managementApi).origin,
        ),
      ...this.pingDependencyApis(),
    ]);
  }

  private pingDependencyApis(): HealthIndicatorFunction[] {
    return this.config.createApiDependencyList().flatMap(({ name, url }) => {
      if (url instanceof Array) {
        return url.map((x, idx) => this.pingApi(`${name}-${idx}`, x));
      } else {
        return this.pingApi(name, url);
      }
    });
  }

  private pingApi(name: string, url: string): HealthIndicatorFunction {
    // 404 is a valid status since it indicates that the endpoints are up.
    // We should change this when the APIs are updated with a health check endpoint
    return () =>
      this.dns.pingCheck(name, url, {
        validateStatus: status =>
          (status >= 200 && status < 300) || status === 404,
      });
  }
}
