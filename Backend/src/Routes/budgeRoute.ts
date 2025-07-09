import { Router } from "express";
import {createBudget,updateBudget,GetBudget,deleteBudget}from '../Controllers/budgetController';
import catchAsync from "../utils/catchAsync";
import isAuthenticated from "../Middleware/auth"
const router = Router();

router.post("/", isAuthenticated, catchAsync(createBudget));
router.put("/", isAuthenticated, catchAsync(updateBudget));
router.get("/", isAuthenticated, catchAsync(GetBudget));
router.delete("/", isAuthenticated, catchAsync(deleteBudget)); 

export default router;
