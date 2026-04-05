import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { MESSAGES } from "@/constants/messages";
import { STATUS_CODES } from "@/constants/statusCodes";

// ✅ Strongly typed handler
type Handler<T = any> = (req: Request, context: T) => Promise<Response>;

export function apiHandler<T = any>(handler: Handler<T>) {
  return async (req: Request, context: T) => {
    try {
      return await handler(req, context);
    } catch (error) {
      // ✅ Zod validation errors
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            message: MESSAGES.VALIDATION_ERROR,
            errors: error.issues.map((e) => ({
              field: e.path[0],
              message: e.message,
            })),
          },
          { status: STATUS_CODES.BAD_REQUEST },
        );
      }

      console.error("API Error:", error);

      return NextResponse.json(
        { message: error instanceof Error ? error.message : MESSAGES.SERVER_ERROR },
        { status: STATUS_CODES.INTERNAL_SERVER_ERROR },
      );
    }
  };
}
