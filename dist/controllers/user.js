import { UserModel } from '../models/User.js';
export const newUser = async (req, res, next) => {
    try {
        const { name, email, photo, gender, _id, dob } = req.body;
        const user = await UserModel.create({ name, email, photo, gender, _id, dob: new Date(dob) });
        return res.status(200).json({
            success: true,
            message: `Welcome,${user.name}`,
        });
    }
    catch (error) {
        next(error);
    }
};
