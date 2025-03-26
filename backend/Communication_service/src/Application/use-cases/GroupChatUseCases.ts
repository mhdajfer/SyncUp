import { IGroupChatRepository } from "../../Domain/repositories";
import { IGroupChatUseCases } from "../../Domain/services";
import { CustomError } from "../../ErrorHandler/CustonError";
import { IChat } from "../../Shared/interfaces";
import { IUser } from "../../Shared/interfaces";
import { StatusCode } from "../../Shared/interfaces/StatusCode";

export class GroupChatUseCases implements IGroupChatUseCases {
  constructor(private _groupChatRepository: IGroupChatRepository) {}
  async createGroupChat(
    groupName: string,
    users: IUser[],
    admin: IUser
  ): Promise<IChat> {
    try {
      if (users.length < 2)
        throw new CustomError(
          "more than 2 user is required to create group chat",
          StatusCode.CONFLICT
        );

      if (!groupName || !admin)
        throw new CustomError(
          "not Provided group name and admin details",
          StatusCode.CONFLICT
        );

      const GroupChat = await this._groupChatRepository.createGroupChat(
        groupName,
        users,
        admin
      );

      return GroupChat;
    } catch (error) {
      throw error;
    }
  }

  async addNewMember(userIds: string[], chatId: string): Promise<IChat> {
    try {
      const updatedChat = await this._groupChatRepository.AddNewMember(
        userIds,
        chatId
      );

      if (!updatedChat)
        throw new CustomError("New member not added", StatusCode.CONFLICT);

      return updatedChat;
    } catch (error) {
      throw error;
    }
  }

  async removeMember(userId: string, chatId: string): Promise<IChat> {
    try {
      const updatedChat = await this._groupChatRepository.removeMember(
        userId,
        chatId
      );

      if (!updatedChat)
        throw new CustomError("member not removed", StatusCode.CONFLICT);

      return updatedChat;
    } catch (error) {
      throw error;
    }
  }
}
