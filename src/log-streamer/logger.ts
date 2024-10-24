import { TransformableInfo } from "logform";
import { PassThrough } from "node:stream";
import winston, { Logger, format, transports } from "winston";
import { contextWrapper } from "../context-wrapper/context-wrapper";

export type LogExhibitionLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

export interface ILogger {
    debug(content): void;
    info(content): void;
    warn(content): void;
    error(content): void;
    createStream(): void;
    finishStream(): void;
    setLevel(level: LogExhibitionLevel): void;
    getLogger(): any;
}

export class WinstonLogger implements ILogger {
    static instance: WinstonLogger;
    private static readonly SEPARATOR = "<LOGEND>";
    private readonly streams = new Map<string, PassThrough>();
    private readonly logger: Logger;

    private constructor() {
        this.logger = winston.createLogger({
            level: "info",
            format: format.combine(
                format.timestamp(),
                format.json(),
                format.printf((info: TransformableInfo) => {
                    const message = info.message;
                    const timestamp: string = info.message?.originalTimestamp ?? info?.timestamp;

                    delete message.originalTimestamp;

                    const log = {
                        severityText: info.level.toUpperCase(),
                        executionId: contextWrapper.executionId,
                        timestamp,
                        message,
                    };

                    return JSON.stringify(log);
                }),
            ),
            transports: [new transports.Console()],
        });
    }

    createStream(): void {
        if (contextWrapper.executionId === "-" || this.streams.has(contextWrapper.executionId)) {
            return;
        }

        this.streams.set(contextWrapper.executionId, new PassThrough());
    }

    finishStream(): void {
        this.streams.delete(contextWrapper.executionId);
    }

    debug(content: any): void {
        if (this.logger.level === "debug") {
            this.logger.debug(content);
            return;
        }

        const originalTimestamp: string = new Date().toISOString();

        this.createStream();
        const stream: PassThrough = this.streams.get(contextWrapper.executionId);

        if (this.hasStreamedLogs()) {
            stream?.write(WinstonLogger.SEPARATOR);
        }

        stream?.write(JSON.stringify({ ...content, originalTimestamp }));
    }

    info(content: any): void {
        this.logger.info(content);
    }

    warn(content: any): void {
        this.logger.warn(content);
    }

    error(content: any): void {
        if (this.hasStreamedLogs()) {
            this.flushStreamedLogs()
                .split(WinstonLogger.SEPARATOR)
                .forEach((streamedLog: string) => {
                    this.logger.info(JSON.parse(streamedLog));
                });

            this.finishStream();
        }

        this.logger.error(content);
    }

    setLevel(level: LogExhibitionLevel): void {
        this.logger.level = level.toLowerCase();
    }

    getLevel(): string {
        return this.logger.level;
    }

    getLogger() {
        return this.logger;
    }

    private hasStreamedLogs(): boolean {
        const logStream: PassThrough = this.streams.get(contextWrapper.executionId);
        return !!(logStream?.readable && logStream?.readableLength);
    }

    private flushStreamedLogs(): string {
        return String(this.streams.get(contextWrapper.executionId)?.read() ?? "");
    }

    static getInstance(): ILogger {
        if (!this.instance) {
            this.instance = new WinstonLogger();
        }

        return this.instance;
    }
}

const logger: ILogger = WinstonLogger.getInstance();

export { logger };
