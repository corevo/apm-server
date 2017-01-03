jest.mock('../../lib/models/package');
import Repository from '../../lib/models/repository';

describe('repository', () => {
  it('should return packages', () => {
    expect(Repository.get).toBeInstanceOf(Array);
  });
  const react = {};
  it(`should set a new package`, () => {
    const oldPackagesCount = Repository.get.length;
    Repository.set(react);
    expect(Repository.get.length).toBe(oldPackagesCount + 1);
    expect(Repository.packages.react).toBeDefined();
  });
});
