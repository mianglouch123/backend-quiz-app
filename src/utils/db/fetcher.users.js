import { UserModel } from "../../models/user.model.js";

export const fetcher = async (userId) => {
  const user = await UserModel.findById(userId).lean();
  if (!user) return { ok: false, data: null };
  return { ok: true, data: user };
};
