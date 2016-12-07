import { Router } from 'express';
import { getPackages } from '../models/package';

const router = new Router();

router.get('/', (req, res) => {
  getPackages().then(res.json.bind(res)).catch(err => {
    res.status(err.code).json({ message: err.message });
  });
});

router.get('/search', (req, res) => {
  getPackages().then(res.json.bind(res)).catch(err => {
    res.status(err.code).json({ message: err.message });
  });
});

router.get('/:package_name', (req, res) => {
});

router.get('/featured', (req, res) => {
});

router.get('/:package_name/versions/:version_name', (req, res) => {
});

export default router;
