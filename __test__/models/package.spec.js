/* eslint-disable */
import fetchMock from 'fetch-mock';
jest.mock('../../lib/models/repository');
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

describe('featured packages', () => {
  it('have no featured packages', () => {
    expect(Package.featured).toEqual([]);
  });
  it('have 5 packages', () => {
    const topPackages = require('./packages').slice(0, 5);
    Package.featured = topPackages.map(p => p.name);
    expect(Package.featured).toEqual(topPackages);
  });
  it('should eliminate undefined packages', () => {
    Package.featured = ['minimap', undefined, 'linter'];
    expect(Package.featured.length).toBe(2);
  });
});

describe('package searching', () => {
  it(`should count all available packages`, () => {
    expect(Package.count).toBe(90);
  });
  const topPackagesCount = 5, nextPackagesStart = 5, topPackages = require('./packages');
  it(`should find the top ${topPackagesCount} packages`, () => {
    const top5 = Package.find({limit: topPackagesCount});
    expect(top5.length).toBe(topPackagesCount);
    const top5names = top5.map((i) => (i.name));
    expect(top5names.join(',')).toBe(topPackages.slice(0, topPackagesCount).map(i => (i.name)).join(','));
  });
  it(`should find the next ${topPackagesCount} after #${nextPackagesStart}`, () => {
    const next5 = Package.find({
      limit: topPackagesCount,
      offset: nextPackagesStart
    }).map(i => (i.name));
    expect(next5.join(',')).toBe(topPackages.slice(nextPackagesStart, nextPackagesStart + topPackagesCount).map(i => (i.name)).join(','));
  });
  const query = 'minimap';
  it(`should search for '${query}' package`, () => {
    const results = Package.find(query);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe(query);
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
