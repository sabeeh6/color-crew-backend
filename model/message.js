import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sketch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sketch',
        required: true,
        index: true
    },
    sender: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Optimization: Index by sketch and timestamp for fast history retrieval
messageSchema.index({ sketch: 1, createdAt: 1 });

export const messageModel = mongoose.model('Message', messageSchema);
