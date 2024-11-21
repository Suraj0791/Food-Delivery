import { Request, Response, NextFunction } from 'express';
import * as menuService from '../services/menu-service.ts';

class MenuController {
  async addMenu(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('Request received for adding menu');
      const userId = req.userId;
      if (!userId) {
        throw new Error('User ID is required');
      }
      console.log('User ID:', userId);

      const data = req.body;
      const file = req.file;
      console.log('Data received:', data);
      console.log('File received:', file);

      if (!file) {
        throw new Error('File is required');
      }

      const menu = await menuService.addMenu(data, file, userId);
      res.status(201).json({
        success: true,
        message: 'Menu added successfully',
        menu,
      });
    } catch (error) {
      console.error('Error adding menu:', error);
      next(error);
    }
  }

  async editMenu(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const file = req.file;
      console.log('Data received:', data);
      console.log('File received:', file);

      const menu = await menuService.editMenu(id, data, file);
      res.status(200).json({
        success: true,
        message: 'Menu updated successfully',
        menu,
      });
    } catch (error) {
      console.error('Error editing menu:', error);
      next(error);
    }
  }
}

export default new MenuController();