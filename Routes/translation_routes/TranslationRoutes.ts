import { Express , Router } from "express";
import { translationConfigSettings } from "../../Controllers/translation_controller/translationController";


const router = Router()

router.get('/ISO/:languageSelector', translationConfigSettings)

export default router