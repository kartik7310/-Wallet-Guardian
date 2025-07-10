import { Router } from "express";
import {createBudget,updateBudget,GetBudget,deleteBudget}from '../Controllers/budgetController';
import catchAsync from "../utils/catchAsync";
import isAuthenticated from "../Middleware/auth"
const router = Router();

router.post("/create-budget", isAuthenticated, catchAsync(createBudget));
router.put("/update-budget", isAuthenticated, catchAsync(updateBudget));
router.get("/get-budget", isAuthenticated, catchAsync(GetBudget));
router.delete("/budget-delete/:budgetId", isAuthenticated, catchAsync(deleteBudget)); 

export default router;

