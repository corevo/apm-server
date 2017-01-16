import { Router } from 'express';
import Package from '../models/package';

const debug = require('debug')('application:controller:package');
const router = new Router();
const resultsPerPage = 30;

router.get('/', listPackages);

router.get('/search', listPackages);

router.get('/:package_name', listSinglePackage);

router.get('/featured', (req, res) => {
  res.json(Package.featured);
});

router.get('/:package_name/versions/:version_name', listSinglePackage);

// Unimplemented apis
router.post('/:package_name/versions', notImplemented);
router.delete('/:package_name/versions/:version_name', notImplemented);

function listPackages(req, res) {
  let query = req.query.q;
  let page = req.query.page ? req.query.page : 1;
  const results = Package.find(query, { limit: resultsPerPage, offset: resultsPerPage * (page - 1) });
  const lastPage = Math.ceil(Package.count / resultsPerPage);
  res.append('Link', [`<${process.env.DOMAIN}/api/packages?page=${page}>; rel="self"`,
                      `<${process.env.DOMAIN}/api/packages?page=${lastPage}>; rel="last"`,
                      `<${process.env.DOMAIN}/api/packages?page=${Math.min(page + 1, lastPage)}>; rel="next"`]);
  res.json(results);
}

function listSinglePackage(req, res) {
  Package.findOne(req.params.package_name).then(res.json.bind(res)).catch(err => {
    if (err.code < 400) {
      debug(err.message);
      res.sendStatus(500);
    } else {
      res.status(err.code).send(err.message);
    }
  });
}

function notImplemented(req, res) {
  res.sendStatus(501);
}

export default router;
