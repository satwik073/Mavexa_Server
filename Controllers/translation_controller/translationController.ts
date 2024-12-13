import pathSpecifier from "path";
import fileSystem from 'fs';
import { ISO_Structures, JSON_PACKETS } from "../../Common/structure";
import { ASYNC_ERROR_HANDLER_ESTAIBLISHED } from "../../Middlewares/Error/ErrorHandlerReducer";
import { Request, Response } from "express";
import HTTPS_STATUS_CODE from "http-status-codes";

export const translationConfigSettings = ASYNC_ERROR_HANDLER_ESTAIBLISHED(async (request: Request, response: Response) => {

    const { languageSelector } = request.params;
    const translationSupport: { [key: string]: string } = {
        [ISO_Structures.ISO_639_EIN]: JSON_PACKETS.ISO_639_EIN,
        [ISO_Structures.ISO_723_HIN]: JSON_PACKETS.ISO_723_HIN,
        [ISO_Structures.ISO_812_FRN]: JSON_PACKETS.ISO_812_FRN,
    };

    if (languageSelector && languageSelector in translationSupport) {
        const filePath = pathSpecifier.join(__dirname,'../..', 'Translations', translationSupport[languageSelector]);
        console.log("path",filePath)     
        if (fileSystem.existsSync(filePath)) {
            const fileContent = fileSystem.readFileSync(filePath, 'utf-8');
            console.log(fileContent)
            return response.json(JSON.parse(fileContent));
        } else {
            return response.status(HTTPS_STATUS_CODE.NOT_FOUND).json({ error: 'Translation file not found.' });
        }
    } else {
        console.log(`Invalid language selector: ${languageSelector}`);
        return response.status(HTTPS_STATUS_CODE.METHOD_NOT_ALLOWED).json({ error: 'Invalid language selector.' });
    }
});
