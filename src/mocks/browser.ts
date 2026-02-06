import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/**
 * MSW 브라우저 워커
 * - 개발 환경에서 API 모킹
 */
export const worker = setupWorker(...handlers);
