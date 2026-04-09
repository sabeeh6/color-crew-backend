import mongoose from 'mongoose';

const sketchSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A sketch must belong to a user']
    },
    title: {
        type: String,
        required: [true, 'A sketch must have a title'],
        trim: true,
        maxlength: [60, 'A sketch title must have less or equal than 60 characters'],
        default: 'Untitled Sketch'
    },
    fabricJSON: {
        type: mongoose.Schema.Types.Mixed, // Stores dynamic fabric canvas JSON
        required: [true, 'A sketch must have canvas data']
    },
    thumbnailBase64: {
        type: String, // Data URL
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Create index for fast retrieval of user's sketches, sorted by recent updates
sketchSchema.index({ user: 1, updatedAt: -1 });

export const sketchModel = mongoose.model('Sketch', sketchSchema);
