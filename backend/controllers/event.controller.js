import Event from '../models/event.model.js';

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('createdBy', 'name').populate('attendees', 'name');
        res.status(200).json({ success: true, events });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { title, description, date, attendees } = req.body;
        const createdBy = req.user._id;

        const newEvent = await Event.create({
            title,
            description,
            date,
            createdBy,
            attendees
        });

        res.status(201).json({ success: true, event: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
