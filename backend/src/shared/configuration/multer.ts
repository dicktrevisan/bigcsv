import { diskStorage } from 'multer';
import * as path from 'path';

const multerConfig = {
  storage: diskStorage({
    destination: './chegada',
    filename: (id, file, cb) => {
      const fileName ="file";

      const extension = path.parse(file.originalname).ext;
      cb(null, `${fileName}${extension}`);
    },
  }),
};
export default multerConfig;