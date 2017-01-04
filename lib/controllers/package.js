import { Router } from 'express';
import Package from '../models/package';

const router = new Router();
const resultsPerPage = 30;
const lastPage = Math.ceil(Package.count / resultsPerPage);

router.get('/', listPackages);

router.get('/search', listPackages);

router.get('/:package_name', (req, res) => {
});

router.get('/featured', (req, res) => {
});

router.get('/:package_name/versions/:version_name', (req, res) => {
});

function listPackages(req, res) {
  let query = req.query.q;
  let page = req.query.page ? req.query.page : 1;
  const results = Package.find(query, { limit: resultsPerPage, offset: resultsPerPage * (page - 1) });
  res.append('Link', `<${process.env.DOMAIN}/api/packages?page=${page}>; rel="self",
                      <${process.env.DOMAIN}/api/packages?page=${lastPage}>; rel="last",
                      <${process.env.DOMAIN}/api/packages?page=${Math.min(page + 1, lastPage)}>; rel="next"`);
  res.json(results);
}

export default router;
