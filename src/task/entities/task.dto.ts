import { PartialType } from "@nestjs/swagger";
import { Task } from "./task.entity";

export class taskDto extends PartialType(Task) {};