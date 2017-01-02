import Repository from '../../lib/models/repository';

describe('repository', () => {
  it('should return packages', () => {
    expect(Repository.get).toBeInstanceOf(Array);
  });
});
