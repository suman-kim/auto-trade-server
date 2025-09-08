import { KISTransactionID } from "../kis-constants";

// KIS 웹소켓 실시간 데이터 구조
export interface KISWebSocketHeader {
    status: string;           // 0: 정상, 1: 오류
    trId: string;            // 거래ID (HDFSASP0)
    contentLength: string;    // 데이터 길이
  }

// KisRawFrame 타입 추가
export type KisRawFrame = {
  flag: string;     // ex) "0"
  trId: string;     // ex) "H0STCNT0" (체결) / "H0STASP0" (호가)
  code: string;     // ex) "001"
  payload: string;  // ^로 구분된 본문
};

/**
 * 해외주식 실시간 호가 데이터 구조 (HDFSASP0)
 */
export interface OverseasStockRealTimeQuote {
  trKey: string;           // RBAQTSLA (R + 시장코드 + 종목코드)
  stockCode: string;       // TSLA (종목코드)
  field1: string;          // 4 (미확인 필드)
  localDate: string;          // 20250827 (미국 날짜)  
  localTime: string;          // 152702 (미국 시간 - HHMMSS)
  koreanDate: string;      // 20250827 (한국 날짜)
  koreanTime: string;      // 022702 (한국 시간 - HHMMSS)
  bidTotalQuantity: number;     // -31 (매수 총 잔량)
  askTotalQuantity: number;     // -39 (매도 총 잔량)
  bidTotalQuantityRatio: number;     // -31 (매수 총 잔량 대비)
  askTotalQuantityRatio: number;     // -39 (매도 총 잔량 대비)
  bidPrice: number;        // 2577 (매수호가1 - 센트단위)
  askPrice: number;        // 987 (매도호가1 - 센트단위)
  bidQuantity: number;     // -31 (매수잔량1)
  askQuantity: number;     // -39 (매도잔량1)
  bidQuantityRatio: number;     // -31 (매수잔량1 대비)
  askQuantityRatio: number;     // -39 (매도잔량1 대비)

}

/**
 * 해외주식 실시간 체결가 데이터 구조 (H0STCNT0)
 */
export interface OverseasStockRealTimeTrade {
  trKey: string;           // RSYM - 실시간종목코드
  stockCode: string;       // SYMB - 종목코드
  decimalPlaces: number;   // ZDIV - 수수점자리수
  localBusinessDate: string; // TYMD - 현지영업일자
  localDate: string;       // XYMD - 현지일자
  localTime: string;       // XHMS - 현지시간
  koreanDate: string;      // KYMD - 한국일자
  koreanTime: string;      // KHMS - 한국시간
  openPrice: number;       // OPEN - 시가
  highPrice: number;       // HIGH - 고가
  lowPrice: number;        // LOW - 저가
  currentPrice: number;    // LAST - 현재가
  changeSign: number;      // SIGN - 대비구분
  changeDiff: number;      // DIFF - 전일대비
  changeRate: number;      // RATE - 등락율
  bidPrice: number;        // PBID - 매수호가
  askPrice: number;        // PASK - 매도호가
  bidVolume: number;       // VBID - 매수잔량
  askVolume: number;       // VASK - 매도잔량
  tradeVolume: number;     // EVOL - 체결량
  totalVolume: number;     // TVOL - 거래량
  tradeAmount: number;     // TAMT - 거래대금
  sellTradeVolume: number; // BIVL - 매도체결량 (매수호가가 매도주문 수량을 따라가서 체결된것)
  buyTradeVolume: number;  // ASVL - 매수체결량 (매도호가가 매수주문 수량을 따라가서 체결된것)
  tradeStrength: number;   // STRN - 체결강도
  marketType: number;      // MTYP - 시장구분 1:장중,2:장전,3:장후

}

  
  
// 웹소켓 데이터 파서 클래스
export class KISWebSocketParser {
    

  /**
   * 웹소켓 원시 데이터를 파싱 (기존 방식)
   * @param rawData - "0|HDFSASP0|001|RBAQTSLA^TSLA^4^..." 형태의 원시 데이터
   */
  static parseRawData(rawData: string): {header: KISWebSocketHeader; body: any} {
    const parts = rawData.split('|');
    
    if (parts.length < 4) {
      throw new Error('Invalid websocket data format');
    }

    // 헤더 파싱
    const header: KISWebSocketHeader = {
      status: parts[0],           // 0
      trId: parts[1],            // HDFSASP0  
      contentLength: parts[2],    // 001
    };

    // 데이터 부분 파싱 (^ 구분자로 분리)
    const dataFields = parts[3].split('^');
    
    if (dataFields.length < 16) {
      throw new Error(`Insufficient data fields. Expected at least 16, got ${dataFields.length}`);
    }

    let body:any;

    //해외 주식 실시간 체결가
    if(header.trId === KISTransactionID.OVERSEAS_STOCK_REAL_TIME_TRADE_DELAYED){
      const obj:OverseasStockRealTimeTrade =
      {
        trKey: dataFields[0],           // RBAQTSLA (R + 시장코드 + 종목코드)
        stockCode: dataFields[1],       // TSLA (종목코드)
        decimalPlaces: parseFloat(dataFields[2]),   // ZDIV - 수수점자리수
        localBusinessDate: dataFields[3], // TYMD - 현지영업일자
        localDate: dataFields[4],       // XYMD - 현지일자
        localTime: dataFields[5],       // XHMS - 현지시간
        koreanDate: dataFields[6],      // KYMD - 한국일자
        koreanTime: dataFields[7],      // KHMS - 한국시간
        openPrice: parseFloat(dataFields[8]),       // OPEN - 시가
        highPrice: parseFloat(dataFields[9]),       // HIGH - 고가
        lowPrice: parseFloat(dataFields[10]),        // LOW - 저가
        currentPrice: parseFloat(dataFields[11]),    // LAST - 현재가
        changeSign: parseFloat(dataFields[12]),      // SIGN - 대비구분
        changeDiff: parseFloat(dataFields[13]),      // DIFF - 전일대비
        changeRate: parseFloat(dataFields[14]),      // RATE - 등락율
        bidPrice: parseFloat(dataFields[15]),        // PBID - 매수호가
        askPrice: parseFloat(dataFields[16]),        // PASK - 매도호가
        bidVolume: parseFloat(dataFields[17]),       // VBID - 매수잔량
        askVolume: parseFloat(dataFields[18]),       // VASK - 매도잔량
        tradeVolume: parseFloat(dataFields[19]),     // EVOL - 체결량
        totalVolume: parseFloat(dataFields[20]),     // TVOL - 거래량
        tradeAmount: parseFloat(dataFields[21]),     // TAMT - 거래대금
        sellTradeVolume: parseFloat(dataFields[22]), // BIVL - 매도체결량 (매수호가가 매도주문 수량을 따라가서 체결된것을 표현하여 BIVL 이라는 표현을 사용)
        buyTradeVolume: parseFloat(dataFields[23]),  // ASVL - 매수체결량 (매도호가가 매수주문 수량을 따라가서 체결된것을 표현하여 ASVL 이라는 표현을 사용)
        tradeStrength: parseFloat(dataFields[24]),   // STRN - 체결강도
        marketType: parseFloat(dataFields[25])      // MTYP - 시장구분 1:장중,2:장전,3:장후
      }
      body = obj;
    }

    //해외 주식 실시간 호가
    if(header.trId === KISTransactionID.OVERSEAS_STOCK_REAL_TIME_TRADE){
      
      const obj:OverseasStockRealTimeQuote =
      {
        trKey: dataFields[0],           // RBAQTSLA (R + 시장코드 + 종목코드)
        stockCode: dataFields[1],       // TSLA (종목코드)
        field1: dataFields[2],          // 4 (미확인 필드)
        localDate: dataFields[3],          // 20250827 (미국 날짜)  
        localTime: dataFields[4],          // 152702 (미국 시간 - HHMMSS)
        koreanDate: dataFields[5],      // 20250827 (한국 날짜)
        koreanTime: dataFields[6],      // 022702 (한국 시간 - HHMMSS)
        bidTotalQuantity: parseFloat(dataFields[7]),     // -31 (매수 총 잔량)
        askTotalQuantity: parseFloat(dataFields[8]),     // -39 (매도 총 잔량)
        bidTotalQuantityRatio: parseFloat(dataFields[9]),     // -31 (매수 총 잔량 대비)
        askTotalQuantityRatio: parseFloat(dataFields[10]),     // -39 (매도 총 잔량 대비)
        bidPrice: parseFloat(dataFields[11]),        // 2577 (매수호가1 - 센트단위)
        askPrice: parseFloat(dataFields[12]),        // 987 (매도호가1 - 센트단위)
        bidQuantity: parseFloat(dataFields[13]),     // -31 (매수잔량1)
        askQuantity: parseFloat(dataFields[14]),     // -39 (매도잔량1)
        bidQuantityRatio: parseFloat(dataFields[15]),     // -31 (매수잔량1 대비)
        askQuantityRatio: parseFloat(dataFields[16]),     // -39 (매도잔량1 대비)
      }
      body = obj;
    }


    return { header, body };
  }

  /**
   * 시간 문자열을 Date 객체로 변환
   * @param date - YYYYMMDD 형태
   * @param time - HHMMSS 형태
   */
  static parseDateTime(date: string, time: string): Date {
    const year = parseFloat(date.substring(0, 4));
    const month = parseFloat(date.substring(4, 6)) - 1; // 월은 0부터 시작
    const day = parseFloat(date.substring(6, 8));
    
    const hour = parseFloat(time.substring(0, 2));
    const minute = parseFloat(time.substring(2, 4));
    const second = parseFloat(time.substring(4, 6));
    
    return new Date(year, month, day, hour, minute, second);
  }

}
  