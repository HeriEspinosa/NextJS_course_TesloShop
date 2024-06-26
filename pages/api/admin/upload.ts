import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = { status: string; message?: string } | { status: string; results?: string };

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return UploadFile(req, res);

        default:
            return res.status(400).json({
                status: 'error',
                message: 'Bad request',
            });
    }
}

const saveFile = async (file: formidable.File): Promise<string> => {
    const { secure_url } = await cloudinary.uploader.upload(file.filepath);
    return secure_url;
};

const parseFiles = async (req: NextApiRequest): Promise<string> => {
    return new Promise((resolve, reject) => {
        const form = formidable({});
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return reject(err);
            }

            const filePath = await saveFile(files.file![0] as formidable.File);

            resolve(filePath);
        });
    });
};

const UploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const imageUrl = await parseFiles(req);

    return res.status(200).json({
        status: 'success',
        results: imageUrl,
    });
};
