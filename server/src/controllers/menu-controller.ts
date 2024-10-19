import { Request, Response, NextFunction } from 'express';
import { addMenu, editMenu } from '../services/menu-service';

class MenuController {
    async addMenu(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const menu = await addMenu(req.body, req.file as Express.Multer.File, req.id);
            res.status(201).json({
                success: true,
                message: 'Menu added successfully',
                menu,
            });
        } catch (error) {
            next(error);
        }
    }

    async editMenu(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const menu = await editMenu(id, req.body, req.file as Express.Multer.File);
            res.status(200).json({
                success: true,
                message: 'Menu updated successfully',
                menu,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new MenuController();