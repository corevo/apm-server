/* eslint-disable */
jest.mock('../../lib/models/package');
import Repository from '../../lib/models/repository';
import Package from '../../lib/models/package';

describe('repository', () => {
  it('should return packages', () => {
    expect(Repository.get).toBeInstanceOf(Array);
  });
  it(`should set a new package`, () => {
    const react = new Package(require('./single_package.recording'));
    const oldPackagesCount = Repository.get.length;
    Repository.set(react);
    expect(Repository.get.length).toBe(oldPackagesCount + 1);
    expect(Repository.packages.react).toBeDefined();
  });
  it(`should update the previous package`, () => {
    const react = new Package(require('./single_package.recording'));
    const react2 = new Package(require('./single_package.recording'));
    Repository.set(react);
    expect(Repository.packages.react).toBe(react);
    Repository.set(react2);
    expect(Repository.packages.react).toBe(react2);
    expect(Repository.packages.react === react).toBeFalsy();
  });
  it(`should throw when setting an invalid package`, () => {
    const invalid = {};
    expect(() => {
      Repository.set(invalid);
    }).toThrowError(`The given ${typeof invalid} is not ${Package.name}`);
  });
  it(`search single package`, () => {
    const react = new Package(require('./single_package.recording'));
    Repository.set(react);
    const results = Repository.search(react.name);
    expect(results.length).toBe(1);
    expect(results[0] instanceof Package).toBeTruthy();
    expect(results[0].name).toBe(react.name);
  });
  it(`search nonexistent package`, () => {
    const react = new Package(require('./single_package.recording'));
    Repository.set(react);
    const results = Repository.search('angular');
    expect(results.length).toBe(0);
  });
  it(`search amongst multiple packages`, () => {
    const packages = require('./packages.recording');
    packages.forEach(p => {
      Repository.set(new Package(p))
    });
    const results = Repository.search('javascript');
    expect(results.length).toBe(12);
  });
});
