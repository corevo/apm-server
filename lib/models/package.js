import fetch from 'isomorphic-fetch';

export default class Package {
  constructor(packageItem) {
    Object.assign(this, packageItem);
  }
}

export function PackageService(registry, name) {
  return fetch(`${registry}/${name}`).then((res) => {
    if (!res.ok) {
      console.log(res);
    } else {
      return res.json().then(parsePackage).then(item => (
        new Package(item)
      ));
    }
  });
}

function parsePackage(x) {
  x["releases"] = x["dist-tags"];
  delete x["dist-tags"];
  return Promise.resolve(x);
}
