import { Logger } from "@nestjs/common";

export const formattedMessage = (message: string): string => {
    const logger = new Logger('prettier-message');
    logger.verbose(message + ' lalalalala');
    return message;
};