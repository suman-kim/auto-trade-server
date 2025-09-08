//해외주식 현재가 상세 응답 객체
export interface OverseasStockCurrentPriceDetailResponse {
    rsym: string; //실시간조회종목코드
    pvol: string; //전일거래량  
    open: string; //시가
    high: string; //고가
    low: string; //저가
    last: string; //현재가
    base: string; //전일종가
    tomv: string; //시가총액
    pamt: string; //전일거래대금
    uplp: string; //상한가
    dnlp: string; //하한가
    h52p: string; //52주최고가
    h52d: string; //52주최고일자
    l52p: string; //52주최저가
    l52d: string; //52주최저일자
    perx: string; //PER
    pbrx: string; //PBR
    epsx: string; //EPS
    bpsx: string; //BPS
    shar: string; //상장주수
    mcap: string; //자본금
    curr: string; //통화
    zdiv: string; //소수점자리수
    vnit: string; //매매단위
    t_xprc: string; //원환산당일가격
    t_xdif: string; //원환산당일대비
    t_xrat: string; //원환산당일등락
    p_xprc: string; //원환산전일가격
    p_xdif: string; //원환산전일대비
    p_xrat: string; //원환산전일등락
    t_rate: string; //당일환율
    p_rate: string; //전일환율
    t_xsgn: string; //원환산당일기호
    p_xsng: string; //원환산전일기호
    e_ordyn: string; //거래가능여부
    e_hogau: string; //호가단위
    e_icod: string; //업종(섹터)
    e_parp: string; //액면가
    tvol: string; //거래량
    tamt: string; //거래대금
    etyp_nm: string; //ETP 분류명
}



// {
//     "output": {
//         "rsym": "DNASTSLA",
//         "zdiv": "4",
//         "base": "329.3600",
//         "pvol": "58391952",
//         "last": "334.0900",
//         "sign": "2",
//         "diff": "4.7300",
//         "rate": "+1.44",
//         "tvol": "88733288",
//         "tamt": "29913979335",
//         "ordy": "매도불가"
//     },
//     "rt_cd": "0",
//     "msg_cd": "MCA00000",
//     "msg1": "정상처리 되었습니다."
// }
//해외주식 현재체결가 응답 객체 
export interface OverseasStockCurrentPriceResponse {
    rsym:string; //실시간 조회 종목코드
    zdiv:string; // 소수점 자리수
    base:string; // 전일 종가
    pvol:string; //전일 거래량
    last:string; //현재가 
    sign:string; //대비 기호
    diff:string; //대비
    rate:string; //등락율
    tvol:string; //거래량
    tamt:string; //거래대금
    ordy:string; //거래가능여부
}


// {
//     "ctx_area_fk200": "",
//     "ctx_area_nk200": "                                                                                                    ",
//     "output1": [
//         {
//             "cano": "50151963",
//             "acnt_prdt_cd": "01",
//             "prdt_type_cd": "100",
//             "ovrs_pdno": "TSLA",
//             "ovrs_item_name": "테슬라",
//             "frcr_evlu_pfls_amt": "17.995800",
//             "evlu_pfls_rt": "1.35",
//             "pchs_avg_pric": "334.0310",
//             "ovrs_cblc_qty": "4",
//             "ord_psbl_qty": "4",
//             "frcr_pchs_amt1": "1336.12420",
//             "ovrs_stck_evlu_amt": "1354.12000000",
//             "now_pric2": "338.530000",
//             "tr_crcy_cd": "USD",
//             "ovrs_excg_cd": "NASD",
//             "loan_type_cd": "",
//             "loan_dt": "",
//             "expd_dt": ""
//         }
//     ],
//     "output2": {
//         "frcr_pchs_amt1": "1860820.17334",
//         "ovrs_rlzt_pfls_amt": "0.00000",
//         "ovrs_tot_pfls": "25062.75066",
//         "rlzt_erng_rt": "0.00000000",
//         "tot_evlu_pfls_amt": "25062.75066000",
//         "tot_pftrt": "1.34686581",
//         "frcr_buy_amt_smtl1": "1860820.173340",
//         "ovrs_rlzt_pfls_amt2": "0.00000",
//         "frcr_buy_amt_smtl2": "1860820.173340"
//     },
//     "rt_cd": "0",
//     "msg_cd": "20310000",
//     "msg1": "모의투자 조회가 완료되었습니다.                                                 "
// }
/**
 * 해외주식 잔고 개별 종목 정보
 */
export interface OverseasStockHoldingItem {
    cano: string; // 종합계좌번호
    acnt_prdt_cd: string; // 계좌상품코드
    prdt_type_cd: string; // 상품유형코드
    ovrs_pdno: string; // 해외상품번호
    ovrs_item_name: string; // 해외종목명
    frcr_evlu_pfls_amt: string; // 외화평가손익금액
    evlu_pfls_rt: string; // 평가 손익율
    pchs_avg_pric: string; // 매입 평균 가격
    ovrs_cblc_qty: string; // 해외잔고수량
    ord_psbl_qty: string; // 매도 가능 수량 
    frcr_pchs_amt1: string; // 외화매입금액1
    ovrs_stck_evlu_amt: string; // 해외주식평가금액
    now_pric2: string; // 현재가격2
    tr_crcy_cd: string; // 거래통화코드ㄴ
    ovrs_excg_cd: string; // 해외거래소코드
    loan_type_cd: string; // 대출유형코드
    loan_dt: string; // 대출일자
    expd_dt: string; // 만기일자
}

/**
 * 해외주식 잔고 요약 정보
 */
export interface OverseasStockHoldingSummary {
    frcr_pchs_amt1: string; // 외화매입금액1
    ovrs_rlzt_pfls_amt: string; // 해외실현손익금액
    ovrs_tot_pfls: string; // 해외총손익
    rlzt_erng_rt: string; // 실현수익율
    tot_evlu_pfls_amt: string; // 총평가손익금액
    tot_pftrt: string; // 총수익률
    frcr_buy_amt_smtl1: string; // 외화매수금액합계1 (총 잔고)
    ovrs_rlzt_pfls_amt2: string; // 해외실현손익금액2
    frcr_buy_amt_smtl2: string; // 외화매수금액합계2
}

/**
 * 해외주식 잔고 응답 객체
 */
export interface OverseasStockHoldingResponse {
    ctx_area_fk200: string; // 컨텍스트영역1
    ctx_area_nk200: string; // 컨텍스트영역2
    output1: OverseasStockHoldingItem[]; // 응답상세1
    output2: OverseasStockHoldingSummary; // 응답상세2
    rt_cd: string; // 응답코드
    msg_cd: string; // 응답메시지코드
    msg1: string; // 응답메시지
}