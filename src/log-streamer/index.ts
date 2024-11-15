import { contextWrapper } from "../context-wrapper/context-wrapper";
import { logger } from "./logger";

// Log Streamer
// Feature utilizada quando logLevel é DEBUG para emitir logs DEBUG quando um log ERROR é emitido

// Quando o level é "INFO", os logs do tipo "DEBUG"
// são perdidos
contextWrapper.run(() => {
    contextWrapper.executionId = "executionId1";

    logger.setLevel("INFO");
    logger.info({ content: "Log 1" });

    // Ordem que os logs serão exibidos: 1 | 3 | 2 | 4
    setTimeout(() => {
        logger.debug({ content: "Log 2 (Exibido fora de ordem)" });
    }, 2_000);

    setTimeout(() => {
        logger.info({ content: "Log 3" });
    }, 1_000);

    setTimeout(() => {
        logger.error({ content: "Log 4" });
    }, 3_000);

    logger.finishStream();
});

// Quando o level é "DEBUG", os logs do tipo "DEBUG"
// são emitidos normalmente
contextWrapper.run(async () => {
    contextWrapper.executionId = "executionId2";

    logger.setLevel("DEBUG");
    logger.info({ content: "Log 1" });
    logger.debug({ content: "Log 2 (Exibido fora de ordem)" });
    logger.info({ content: "Log 3" });
    logger.error({ content: "Log 4" });

    logger.finishStream();
});
