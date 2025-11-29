export interface AppError {
  code: number;
  message: string;
  instructions?: string;
  linkTo?: string;
}
