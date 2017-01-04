jest.mock('../../lib/models/package');
import Repository from '../../lib/models/repository';
import Package from '../../lib/models/package';

describe('repository', () => {
  it('should return packages', () => {
    expect(Repository.get).toBeInstanceOf(Array);
  });
  it(`should set a new package`, () => {
    const react = new Package(require('./single_package'));
    const oldPackagesCount = Repository.get.length;
    Repository.set(react);
    expect(Repository.get.length).toBe(oldPackagesCount + 1);
    expect(Repository.packages.react).toBeDefined();
  });
  it(`should update the previous package`, () => {
    const react = new Package(require('./single_package'));
    const react2 = new Package(require('./single_package'));
    Repository.set(react);
    expect(Repository.packages.react).toBe(react);
    Repository.set(react2);
    expect(Repository.packages.react).toBe(react2);
    expect(Repository.packages.react === react).toBeFalsy();
  });
});
