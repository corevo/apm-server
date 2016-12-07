import fetchMock from 'fetch-mock';
import Package, {PackageService} from '../../lib/models/package';

describe('react package', () => {
  const react = new Package(require('./single_package'));
  it('should have releases', () => {
    expect(react.releases).toBeDefined();
  });
});

describe('package service', () => {
  const registry = 'https://registry.npmjs.org', testPackage = 'whiten', nonExistentPackage = 'kaki';
  fetchMock.get(`${registry}/${testPackage}`, require('./whiten'));
  fetchMock.get(`${registry}/${nonExistentPackage}`, {
    body: {},
    status: 404
  });
  it(`should be ${testPackage}`, () => {
    return PackageService(registry, testPackage).then(item => {
      expect(item.name).toBe(testPackage);
      expect(item.releases).toBeDefined();
    });
  });
  it(`should not find ${nonExistentPackage}`, () => {
    return PackageService(registry, nonExistentPackage).catch(err => {
      expect(err.code).toBe(404);
      expect(err.message).toBeDefined();
    });
  });
  afterAll(() => {
    fetchMock.restore();
  });
});
