//event emitter type
export enum EventEmitterType {
    /** 호가 데이터 */
    ORDERBOOK = 'orderbook',
    /** 체결 데이터 */
    TRADE = 'trade',
    /** 주문 체결 데이터 */
    ORDER_EXECUTION = 'orderExecution',
    /** 잔고 데이터 */
    BALANCE = 'balance',
    /** 하트비트 데이터 */
    HEARTBEAT = 'heartbeat',
    /** 연결 끊김 데이터 */
    DISCONNECT = 'disconnected',
    /** 연결 성공 데이터 */
    CONNECT = 'connected',
    /** 오류 데이터 */
    ERROR = 'kisError', 
    /** 재연결 데이터 */
    RECONNECT = 'reconnected', 
    /** 최대 재연결 시도 횟수 초과 데이터 */
    MAX_RECONNECT_ATTEMPTS_REACHED = 'maxReconnectAttemptsReached',
}