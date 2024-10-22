import { StartedTestContainer } from 'testcontainers/build/test-container';

export function retrievePortFromBinding(
  container: StartedTestContainer,
  sourcePort: number,
): number {
  return Number.parseInt(
    (container as never as any).inspectResult.NetworkSettings.Ports[
      `${sourcePort}/tcp`
    ].find((p: { HostIp: string; HostPort: string }) => p.HostIp === '0.0.0.0')
      .HostPort,
  );
}
