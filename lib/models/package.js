import semver from 'semver';
import _ from 'lodash';

export default class Package {
  constructor (packageItem) {
    Object.assign(this, packageItem);
  }
  filter (engine) {
    const version = semver.valid(engine);
    if (!version) {
      throw new Error(`Invalid semver ${engine}`);
    }
    let filtered = new Package(this);
    Object.assign(filtered, {versions: {}});
    filtered.versions = _.pickBy(this.versions, (packageVersion) => {
      return semver.satisfies(version, packageVersion.engines.atom);
    });
    return filtered;
  }
}

export function PackageService(registry, name) {
  return fetch(`${registry}/${name}`).then((res) => {
    if (!res.ok) {
      return Promise.reject({
        code: res.status,
        message: res.statusText
      });
    } else {
      return res.json().then(parsePackage).then(item => (
        new Package(item)
      ));
    }
  });
}

export function find() {
}

export function findOne() {
}

export function getPackages() {
  return Promise.resolve([new Package(require('../../__test__/models/single_package'))]);
}

function parsePackage(x) {
  x["releases"] = x["dist-tags"];
  delete x["dist-tags"];
  return Promise.resolve(x);
}
