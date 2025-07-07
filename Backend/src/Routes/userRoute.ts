  import {CreateProfile,ViewProfile,updateProfile} from "../Controllers/userController";

  import { Router } from "express";

  const router = Router();

  router.post("/add-profile", CreateProfile);

  router.get("/view-profile", ViewProfile);

  router.put("/update-profile", updateProfile);


  export default router