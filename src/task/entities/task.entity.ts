import { isEmpty } from "lodash";

export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
};

export class Task {

    id: string
    title: string
    description: string
    status: TaskStatus
    private discount: number

    constructor(taskDto: Partial<Task>) {
        this.id = taskDto.id;
        this.title = taskDto.title;
        this.description = taskDto.description;
        this.status = isEmpty(taskDto.status) ?  TaskStatus.PENDING : taskDto.status;
        this.discount = 50;
    }

    getDiscount(): number {
        return this.status == TaskStatus.IN_PROGRESS ? this.discount : 10;
    }

};
