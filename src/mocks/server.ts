import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/**
 * MSW 노드 서버
 * - 테스트 환경에서 API 모킹
 */
export const server = setupServer(...handlers);
