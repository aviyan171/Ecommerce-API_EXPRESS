import mongoose from 'mongoose';
export const createModel = ({ modelName, schema, }) => {
    // Create and return the model using the given model name and schema
    return mongoose.model(modelName, schema);
};
