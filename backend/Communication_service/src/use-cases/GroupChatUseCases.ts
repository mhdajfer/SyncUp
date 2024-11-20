import { CustomError } from "../ErrorHandler/CustonError";
import { IChat } from "../interfaces/IChat";
import { IGroupChatRepository } from "../interfaces/IGroupChatRepository";
import { IGroupChatUseCases } from "../interfaces/IGroupChatUseCases";
import { IUser } from "../interfaces/IUser";

export class GroupChatUseCases implements IGroupChatUseCases {
  constructor(private groupChatRepository: IGroupChatRepository) {}
  async createGroupChat(
    groupName: string,
    users: IUser[],
    admin: IUser
  ): Promise<IChat> {
    try {
      if (users.length < 2)
        throw new CustomError(
          "more than 2 user is required to create group chat",
          409
        );

      if (!groupName || !admin)
        throw new CustomError("Provided group name and admin details", 409);

      const GroupChat = await this.groupChatRepository.createGroupChat(
        groupName,
        users,
        admin
      );

      return GroupChat;
    } catch (error) {
      throw error;
    }
  }
}
