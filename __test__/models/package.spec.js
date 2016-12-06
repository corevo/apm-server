import Package, {PackageService} from '../../lib/models/package';

describe('react package', () => {
  const react = new Package(require('./single_package'));
  it('should have releases', () => {
    expect(react.releases).toBeDefined();
  });
});

describe('package service', () => {
  it('should be express', () => {
    return PackageService('https://registry.npmjs.org', 'express').then(item => {
      expect(item.name).toBe('express');
      expect(item.releases).toBeDefined();
    });
  });
});
