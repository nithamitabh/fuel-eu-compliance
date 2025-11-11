// backend/src/adapters/inbound/http/error.middleware.ts
import { Request, Response, NextFunction } from 'express';

export class ErrorMiddleware {
  static handle(err: Error, req: Request, res: Response, next: NextFunction): void {
    console.error('Error:', err);

    // Check for specific error types
    if (err.message.includes('not found')) {
      res.status(404).json({
        success: false,
        error: err.message,
      });
      return;
    }

    if (err.message.includes('required') || err.message.includes('invalid')) {
      res.status(400).json({
        success: false,
        error: err.message,
      });
      return;
    }

    // Generic server error
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
}
