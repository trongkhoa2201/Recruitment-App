import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IJob>('Job', JobSchema);
