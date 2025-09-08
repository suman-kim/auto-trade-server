//실전
export const KISTransactionID = {
    /** (웹소켓) 해외 주식 실시간 호가 */ 
    OVERSEAS_STOCK_REAL_TIME_TRADE: 'HDFSASP0',
    /** (웹소켓) 해외 주식 지연호가(아시아) */
    OVERSEAS_STOCK_DELAYED_TRADE: 'HDFSASP1',
    /** (웹소켓) 해외 주식 실시간 지연 체결가 */
    OVERSEAS_STOCK_REAL_TIME_TRADE_DELAYED: 'HDFSCNT0',
    /** 해외주식 현재가상세 */
    OVERSEAS_STOCK_CURRENT_PRICE_DETAIL: 'HHDFS76200200',
    /** 해외주식 현재체결가 */
    OVERSEAS_STOCK_CURRENT_PRICE: 'HHDFS00000300',
    /** (웹소켓) 국내주식 실시간 체결가 */
    KOREA_STOCK_REAL_TIME_TRADE: 'H0STCNT0',
    /** (웹소켓) 국내주식 실시간 호가 */
    KOREA_STOCK_REAL_TIME_ORDERBOOK: 'H0STASP0',
    /** 해외주식 잔고 */
    OVERSEAS_STOCK_HOLDING: 'TTTS3012R',
}



//모의
export const KISTransactionID_MOCK = {
    /** 해외주식 현재체결가 */
    OVERSEAS_STOCK_CURRENT_PRICE: 'HHDFS00000300',  
    /** 해외주식 잔고 */
    OVERSEAS_STOCK_HOLDING: 'VTTS3012R',

}



// <미국 야간거래 - 무료시세>
// D+시장구분(3자리)+종목코드
// 예) DNASAAPL : D+NAS(나스닥)+AAPL(애플)
// [시장구분]
// NYS : 뉴욕, NAS : 나스닥, AMS : 아멕스
// <미국 야간거래 - 유료시세>
// ※ 유료시세 신청시에만 유료시세 수신가능
// "포럼 > FAQ > 해외주식 유료시세 신청방법" 참고
// R+시장구분(3자리)+종목코드
// 예) RNASAAPL : D+NAS(나스닥)+AAPL(애플)
// [시장구분]
// NYS : 뉴욕, NAS : 나스닥, AMS : 아멕스

// <미국 주간거래>
// R+시장구분(3자리)+종목코드
// 예) RBAQAAPL : R+BAQ(나스닥)+AAPL(애플)
// [시장구분]
// BAY : 뉴욕(주간), BAQ : 나스닥(주간). BAA : 아멕스(주간)

// <아시아국가 - 유료시세>
// ※ 유료시세 신청시에만 유료시세 수신가능
// "포럼 > FAQ > 해외주식 유료시세 신청방법" 참고
// R+시장구분(3자리)+종목코드
// 예) RHKS00003 : R+HKS(홍콩)+00003(홍콩중화가스)
// [시장구분]
// TSE : 도쿄, HKS : 홍콩,
// SHS : 상해, SZS : 심천
// HSX : 호치민, HNX : 하노이
/**
 * 종목 코드
 */
// 기존 호환성을 위한 객체 형태 유지
export const KISStockCode = {
    // 미국 야간거래 - 무료시세 (D+시장구분+종목코드)
    /** 테슬라 (나스닥 야간 무료) */
    TESLA_NIGHT_FREE: 'DNASTSLA',
    /** 애플 (나스닥 야간 무료) */
    APPLE_NIGHT_FREE: 'DNASAAPL',
    /** 아마존 (나스닥 야간 무료) */
    AMAZON_NIGHT_FREE: 'DNASAMZN',
    /** 구글 (나스닥 야간 무료) */
    GOOGLE_NIGHT_FREE: 'DNASGOOGL',

    // 미국 야간거래 - 유료시세 (R+시장구분+종목코드)
    /** 테슬라 (나스닥 야간 유료) */
    TESLA_NIGHT_PAID: 'RNASTSLA',
    /** 애플 (나스닥 야간 유료) */
    APPLE_NIGHT_PAID: 'RNASAAPL',
    /** 아마존 (나스닥 야간 유료) */
    AMAZON_NIGHT_PAID: 'RNASAMZN',
    /** 구글 (나스닥 야간 유료) */
    GOOGLE_NIGHT_PAID: 'RNASGOOGL',

    // 미국 주간거래 (R+시장구분+종목코드)
    /** 테슬라 (나스닥 주간) */
    TESLA_DAY: 'RBAQTSLA',
    /** 애플 (나스닥 주간) */
    APPLE_DAY: 'RBAQAAPL',
    /** 아마존 (나스닥 주간) */
    AMAZON_DAY: 'RBAQAMZN',
    /** 구글 (나스닥 주간) */
    GOOGLE_DAY: 'RBAQGOOGL',

    // 기본 종목코드 (기존 호환성 유지)
    /** 테슬라 */
    TESLA: 'TSLA',
    /** 애플 */
    APPLE: 'AAPL',
    /** 아마존 */
    AMAZON: 'AMZN',
    /** 구글 */
    GOOGLE: 'GOOGL',

    /** 삼성전자 */
    SAMSUNG_ELECTRONICS: '005930',
    /** 현대차 */
    HYUNDAI_MOTOR: '005380',
    /** 현대자동차 */
    HYUNDAI_AUTOMOTIVE: '005380',
    /** 현대중공업 */
    HYUNDAI_CONSTRUCTION: '000660',
}