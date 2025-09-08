export interface OverseasStockCurrentPriceDetailResponse {
    rsym: string;
    pvol: string;
    open: string;
    high: string;
    low: string;
    last: string;
    base: string;
    tomv: string;
    pamt: string;
    uplp: string;
    dnlp: string;
    h52p: string;
    h52d: string;
    l52p: string;
    l52d: string;
    perx: string;
    pbrx: string;
    epsx: string;
    bpsx: string;
    shar: string;
    mcap: string;
    curr: string;
    zdiv: string;
    vnit: string;
    t_xprc: string;
    t_xdif: string;
    t_xrat: string;
    p_xprc: string;
    p_xdif: string;
    p_xrat: string;
    t_rate: string;
    p_rate: string;
    t_xsgn: string;
    p_xsng: string;
    e_ordyn: string;
    e_hogau: string;
    e_icod: string;
    e_parp: string;
    tvol: string;
    tamt: string;
    etyp_nm: string;
}
export interface OverseasStockCurrentPriceResponse {
    rsym: string;
    zdiv: string;
    base: string;
    pvol: string;
    last: string;
    sign: string;
    diff: string;
    rate: string;
    tvol: string;
    tamt: string;
    ordy: string;
}
export interface OverseasStockHoldingItem {
    cano: string;
    acnt_prdt_cd: string;
    prdt_type_cd: string;
    ovrs_pdno: string;
    ovrs_item_name: string;
    frcr_evlu_pfls_amt: string;
    evlu_pfls_rt: string;
    pchs_avg_pric: string;
    ovrs_cblc_qty: string;
    ord_psbl_qty: string;
    frcr_pchs_amt1: string;
    ovrs_stck_evlu_amt: string;
    now_pric2: string;
    tr_crcy_cd: string;
    ovrs_excg_cd: string;
    loan_type_cd: string;
    loan_dt: string;
    expd_dt: string;
}
export interface OverseasStockHoldingSummary {
    frcr_pchs_amt1: string;
    ovrs_rlzt_pfls_amt: string;
    ovrs_tot_pfls: string;
    rlzt_erng_rt: string;
    tot_evlu_pfls_amt: string;
    tot_pftrt: string;
    frcr_buy_amt_smtl1: string;
    ovrs_rlzt_pfls_amt2: string;
    frcr_buy_amt_smtl2: string;
}
export interface OverseasStockHoldingResponse {
    ctx_area_fk200: string;
    ctx_area_nk200: string;
    output1: OverseasStockHoldingItem[];
    output2: OverseasStockHoldingSummary;
    rt_cd: string;
    msg_cd: string;
    msg1: string;
}
