import { JobStatus } from "$lib/Supabase/Types/database.types";
import { Datetime } from "../Extention/Datetime";
import { OrderEntity } from "./Order";
import { ServiceEntity } from "./Service";
import { UserEntity } from "./User";

export class ServiceJobEntity extends Datetime {
    id: number = 0;
    client: UserEntity = new UserEntity();
    serviceProvider: UserEntity = new UserEntity();
    service: ServiceEntity = new ServiceEntity();
    order: OrderEntity = new OrderEntity();
    status: JobStatus = JobStatus.PENDING;
}