import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";

@Processor('audio')
export class AudioProcessor extends WorkerHost {

    async process(job: Job, token?: string): Promise<any> {
        Logger.log(`Processing job ${job.id} with data: ${JSON.stringify(job.data)}`);
        // Add your audio processing logic here
        throw new Error("Method not implemented.");
    }
}