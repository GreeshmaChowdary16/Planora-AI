import { Router } from 'express';
import { 
  analyzeProject, 
  getAllProjects, 
  getProjectById, 
  deleteProject, 
  updateRoadmapTask,
  togglePinProject
} from '../controllers/projectController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { analyzeProjectSchema } from '../utils/validationSchemas';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter specifically on Gemini AI generation endpoints (max 10 analysis calls per 15 minutes)
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: {
    status: 'fail',
    message: 'Too many analysis requests from this IP. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// All project operations require JWT authentication protect middleware
router.use(protect as any);

router.post('/analyze', aiRateLimiter, validate(analyzeProjectSchema), analyzeProject as any);
router.get('/', getAllProjects as any);
router.get('/:id', getProjectById as any);
router.delete('/:id', deleteProject as any);
router.put('/:projectId/roadmap/:taskId', updateRoadmapTask as any);
router.put('/:id/pin', togglePinProject as any);

export default router;
