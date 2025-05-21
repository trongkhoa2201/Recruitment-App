import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IJobLog extends Document {
  jobId: Types.ObjectId;
  userId: Types.ObjectId;
  action: 'create' | 'update' | 'delete' | 'apply';
  timestamp: Date;
  description?: string;
}

const JobLogSchema: Schema = new Schema<IJobLog>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'apply'],
      required: true,
    },
    description: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export default mongoose.model<IJobLog>('JobLog', JobLogSchema);
