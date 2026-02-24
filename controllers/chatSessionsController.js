import { ChatSession } from "../models/ChatSession.js";

export const listChatSessions = async (req, res, next) => {
  try {
    const userId = req.user?._id?.toString?.() || req.user?.id?.toString?.() || req.user?.id;
    const companyId = req.user?.companyId;

    const sessions = await ChatSession.find({ userId, companyId })
      .sort({ updatedAt: -1 })
      .select({ messages: 0 });

    return res.status(200).json({ sessions });
  } catch (error) {
    next(error);
  }
};

export const getChatSession = async (req, res, next) => {
  try {
    const userId = req.user?._id?.toString?.() || req.user?.id?.toString?.() || req.user?.id;
    const companyId = req.user?.companyId;

    const session = await ChatSession.findOne({
      _id: req.params.id,
      userId,
      companyId,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.status(200).json({ session });
  } catch (error) {
    next(error);
  }
};

