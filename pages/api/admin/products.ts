import type { NextApiRequest, NextApiResponse } from 'next';
import { IProduct } from '@/interfaces';
import { db } from '@/database';
import { Product } from '@/models';
import { isValidObjectId } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data =
    | { status: string; message: string }
    | { status: string; products: IProduct[] }
    | { status: string; product: IProduct };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProducts(req, res);

        case 'PUT':
            return updateProducts(req, res);

        case 'POST':
            return createProduct(req, res);

        default:
            return res.status(400).json({ status: 'error', message: 'Bad request' });
    }
}
const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();
    const products = await Product.find().lean().sort({ title: 'asc' });
    await db.disconnect();

    const updatedProducts = products.map((product) => {
        product.images = product.images.map((image) => {
            return image.includes('http')
                ? image
                : `${process.env.HOST_NAME}/products/${image}`;
        });

        return product;
    });

    return res.status(200).json({
        status: 'success',
        products: updatedProducts,
    });
};
const updateProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { _id = '', images = [] } = req.body as IProduct;

    if (!isValidObjectId(_id)) {
        return res.status(400).json({
            status: 'error',
            message: 'The product id is not valid',
        });
    }

    if (images.length < 2) {
        return res.status(400).json({
            status: 'error',
            message: 'At least two images are needed',
        });
    }

    // TODO: Posiblemente tendremos un localhost:3000/products/imagesdidj.jpg

    try {
        await db.connect();
        const product = await Product.findById(_id);

        if (!product) {
            await db.disconnect();

            return res.status(401).json({
                status: 'error',
                message: 'There is no product with this ID',
            });
        }

        // Eliminar fotos en Cloudinary
        product.images.forEach(async (image) => {
            if (!images.includes(image)) {
                const [fileId, extension] = image
                    .substring(image.lastIndexOf('/') + 1)
                    .split('.');
                await cloudinary.uploader.destroy(fileId);
            }
        });

        await product.updateOne(req.body);
        await db.disconnect();

        return res.status(200).json({
            status: 'success',
            product,
        });
    } catch (error) {
        console.log(error);
        await db.disconnect();

        return res.status(400).json({
            status: 'error',
            message: 'Review server log',
        });
    }
};
const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { images = [] } = req.body as IProduct;

    if (images.length < 2) {
        return res.status(400).json({
            status: 'error',
            message: 'At least two images are needed',
        });
    }

    // TODO: Posiblemente tendremos un localhost:3000/products/imagesdidj.jpg

    try {
        await db.connect();
        const productInDB = await Product.findOne({ slug: req.body.slug });

        if (productInDB) {
            await db.disconnect();

            return res.status(400).json({
                status: 'error',
                message: 'There is already a product with that slug',
            });
        }

        const product = new Product(req.body);
        await product.save();
        await db.disconnect();

        return res.status(201).json({
            status: 'success',
            product,
        });
    } catch (error) {
        console.log(error);
        await db.disconnect();

        return res.status(400).json({
            status: 'error',
            message: 'Review server log',
        });
    }
};
