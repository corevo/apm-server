import fetchMock from 'fetch-mock';
import Package, {PackageService} from '../../lib/models/package';

describe('react package', () => {
  const react = new Package(require('./single_package'));
  it('should have releases', () => {
    expect(react.releases).toBeDefined();
  });

  const version = '0.200.0', incompatibleVersion = '0.100.0', invalidSemver = '1.0';
  it(`should be compatible with atom ${version}`, () => {
    expect(react.compatible(version)).toBeTruthy();
  });
  it(`should be incompatible with atom ${incompatibleVersion}`, () => {
    expect(react.compatible(incompatibleVersion)).toBeFalsy();
  });
  it(`should throw an error for an invalid semver ${invalidSemver}`, () => {
    expect(() => {
      react.compatible(invalidSemver)
    }).toThrowError(`Invalid semver ${invalidSemver}`);
  });
  it(`should display versions compatible with atom ${version}`, () => {
    const filtered = react.filter(version);
    const keys = Object.keys(filtered.versions);
    expect(keys.length).toBe(29);
    expect(keys[0]).toBe('0.16.0');
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
