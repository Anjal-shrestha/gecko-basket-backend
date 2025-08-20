import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  province: string;
  cities: {
    name: string;
    zones: string[];
  }[];
}

const LocationSchema: Schema = new Schema({
  province: { type: String, required: true, unique: true },
  cities: [
    {
      name: { type: String, required: true },
      zones: [{ type: String, required: true }],
    },
  ],
});

export default mongoose.model<ILocation>('Location', LocationSchema);