import { sketchModel } from "../model/sketch.js";

// POST /api/sketches
// Create a new sketch or update an existing one
export const saveSketch = async (req, res) => {
    try {
        console.log('\n=============================================');
        console.log('🎨 [API CALL] START: POST /api/sketches');
        console.log('=============================================');
        console.log('Req Body Title:', req.body.title);
        console.log('Has FabricJSON?', !!req.body.fabricJSON);
        console.log('User ID from token:', req.user?.userId);
        console.log('Is Update? (sketchId):', req.body.sketchId || 'No (New Sketch)');
        const { sketchId, title, fabricJSON, thumbnailBase64, isPublic } = req.body;
        const userId = req.user.userId;

        if (sketchId) {
            // Update existing sketch
            const sketch = await sketchModel.findOneAndUpdate(
                { _id: sketchId, user: userId },
                { title, fabricJSON, thumbnailBase64, isPublic },
                { new: true }
            );

            if (!sketch) {
                console.log('❌ ERROR: Sketch not found or user unauthorized for update.');
                return res.status(404).json({ message: "Sketch not found or not authorized" });
            }
            console.log('✅ SUCCESS: Sketch perfectly updated! ID:', sketch._id);
            return res.status(200).json(sketch);
        } else {
            // Create new sketch
            const newSketch = new sketchModel({
                user: userId,
                title,
                fabricJSON,
                thumbnailBase64,
                isPublic: isPublic || false
            });

            await newSketch.save();
            console.log('✅ SUCCESS: New Sketch beautifully saved! ID:', newSketch._id);
            return res.status(201).json(newSketch);
        }
    } catch (error) {
        console.error('❌ CRITICAL ERROR saving sketch:', error.message);
        return res.status(500).json({ message: "Error saving sketch", error: error.message });
    }
};

// GET /api/sketches
// Get paginated sketches for the current user
export const getUserSketches = async (req, res) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const sketches = await sketchModel.find({ user: userId })
            .select("-fabricJSON") // Exclude heavy JSON for listing
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalItems = await sketchModel.countDocuments({ user: userId });
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            sketches,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching sketches", error: error.message });
    }
};

// GET /api/sketches/:id
// Get a single sketch with full JSON
export const getSketchById = async (req, res) => {
    try {
        const { id } = req.params;

        // Allow anyone with the link (ID) to access it
        const sketch = await sketchModel.findById(id);

        if (!sketch) {
            return res.status(404).json({ message: "Sketch not found" });
        }

        res.status(200).json(sketch);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching sketch", error: error.message });
    }
};

// DELETE /api/sketches/:id
export const deleteSketch = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const sketch = await sketchModel.findOneAndDelete({ _id: id, user: userId });

        if (!sketch) {
            return res.status(404).json({ message: "Sketch not found or not authorized" });
        }

        res.status(200).json({ message: "Sketch deleted successfully", id });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting sketch", error: error.message });
    }
};

// PATCH /api/sketches/:id/title
export const renameSketch = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const userId = req.user.userId;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const sketch = await sketchModel.findOneAndUpdate(
            { _id: id, user: userId },
            { title },
            { new: true }
        ).select("-fabricJSON");

        if (!sketch) {
            return res.status(404).json({ message: "Sketch not found or not authorized" });
        }

        res.status(200).json(sketch);
    } catch (error) {
        return res.status(500).json({ message: "Error renaming sketch", error: error.message });
    }
};
