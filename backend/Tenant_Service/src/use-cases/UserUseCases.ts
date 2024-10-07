import { KafkaConnection } from "../Config/kafka/kafkaConnection";
import { CustomError } from "../ErrorHandler/CustonError";
import { UserProducer } from "../events/Producers/UserProducer";
import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserUseCases } from "../interfaces/IUserUseCases";

export class UserUseCases implements IUserUseCases {
  constructor(private userRepository: IUserRepository) {}

  async findUser(email: string): Promise<IUser> {
    try {
      const user = await this.userRepository.findUser(email);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateTenantAdmin(
    tenantId: string,
    adminEmail: string
  ): Promise<IUser> {
    try {
      const tenantAdmin = await this.userRepository.updateTenantAdmin(
        tenantId,
        adminEmail
      );

      if (!tenantAdmin) throw new CustomError("Tenant adimin not updated", 409);

      const kafkaConnection = new KafkaConnection();
      const producer = await kafkaConnection.getProducerInstance();
      const userProducer = new UserProducer(producer);

      await userProducer.sendDefaultMessage(
        "user-updated",
        "user-events",
        JSON.stringify(tenantAdmin)
      );

      return tenantAdmin;
    } catch (error) {
      throw error;
    }
  }

 
}
