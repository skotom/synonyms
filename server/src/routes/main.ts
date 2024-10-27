import express, { Router } from "express";
import wordRouter from "./word";

const router: Router = express.Router();

router.use("/word", wordRouter);
// router.use(express.static(clientPath));

// router.use((req: Request, res: Response) => {
//   const htmlFilePath = path.resolve(`${clientPath}/index.html`);
//   res.sendFile(htmlFilePath);
// });

export default router;
