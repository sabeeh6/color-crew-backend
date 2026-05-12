import { messageModel } from '../model/message.js';

/**
 * Get chat history for a specific sketch
 */
export const getChatHistory = async (req, res) => {
    try {
        const { sketchId } = req.params;
        
        if (!sketchId) {
            return res.status(400).json({
                success: false,
                message: "Sketch ID is required"
            });
        }

        const messages = await messageModel.find({ sketch: sketchId })
            .sort({ createdAt: 1 }) // Oldest first
            .limit(100); // Last 100 messages

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
