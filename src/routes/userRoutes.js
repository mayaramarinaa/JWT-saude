const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const asyncHandler = require('../middlewares/asyncHandler')

router.get('/me', authMiddleware, asyncHandler(userController.me))
router.get('/', authMiddleware, adminMiddleware, asyncHandler(userController.list))
router.get('/:id', authMiddleware, adminMiddleware, asyncHandler(userController.findById))
router.post('/', authMiddleware, adminMiddleware, asyncHandler(userController.create))
router.put('/:id', authMiddleware, adminMiddleware, asyncHandler(userController.update))
router.delete('/:id', authMiddleware, adminMiddleware, asyncHandler(userController.remove))

module.exports = router
