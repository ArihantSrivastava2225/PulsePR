import Chat from '../models/chat.model.js';
import Team from '../models/team.model.js';

export const getChatHistory = async (req, res) => {
    try {
        const { room } = req.params;

        // Check if room is a team room (assuming team rooms are team IDs)
        // If it's a valid ObjectId, it might be a team.
        if (room.match(/^[0-9a-fA-F]{24}$/)) {
            const team = await Team.findById(room);
            if (team) {
                // Check if user is manager or member
                const isMember = team.members.includes(req.user._id);
                const isManager = team.manager.toString() === req.user._id.toString();

                if (!isMember && !isManager) {
                    return res.status(403).json({ success: false, message: "Access denied to this team chat" });
                }
            }
        }

        const messages = await Chat.find({ room })
            .populate('sender', 'name email')
            .sort({ timestamp: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const saveMessage = async (req, res) => {
    try {
        const { message, room } = req.body;
        const sender = req.user._id;

        const newChat = await Chat.create({
            sender,
            message,
            room
        });

        const populatedChat = await Chat.findById(newChat._id).populate('sender', 'name email');

        // Emit message via socket.io (accessed via req.app.get('io'))
        const io = req.app.get('io');
        if (room) {
            io.to(room).emit('receive_message', populatedChat);
        } else {
            io.emit('receive_message', populatedChat);
        }

        res.status(201).json({ success: true, message: populatedChat });
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
