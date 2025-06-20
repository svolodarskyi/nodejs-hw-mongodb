import path from 'path';

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'src', 'tmp');
export const UPLOAD_DIR = path.join(process.cwd(), 'src', 'uploads');
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');