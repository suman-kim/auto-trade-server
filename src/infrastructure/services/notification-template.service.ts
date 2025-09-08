import { Injectable } from '@nestjs/common';

/**
 * 알림 템플릿 서비스
 * 다양한 알림 타입에 대한 템플릿을 관리하고 생성하는 서비스
 */
@Injectable()
export class NotificationTemplateService {
  
  /**
   * 거래 실행 알림 템플릿 생성
   */
  generateTradeExecutedTemplate(data: any): { title: string; message: string } {
    const { symbol, quantity, side, price, totalAmount } = data;
    const action = side === 'BUY' ? '매수' : '매도';
    
    return {
      title: '거래 실행 완료',
      message: `${symbol} ${quantity}주 ${action} 완료\n가격: ${price?.toLocaleString()}원\n총 거래금액: ${totalAmount?.toLocaleString()}원`,
    };
  }

  /**
   * 가격 알림 템플릿 생성
   */
  generatePriceAlertTemplate(data: any): { title: string; message: string } {
    const { symbol, price, condition, previousPrice } = data;
    const changeText = previousPrice 
      ? `(${price > previousPrice ? '상승' : '하락'} ${Math.abs(price - previousPrice).toLocaleString()}원)`
      : '';
    
    return {
      title: '가격 알림',
      message: `${symbol} 가격이 ${condition} ${price.toLocaleString()}원에 도달했습니다. ${changeText}`,
    };
  }

  /**
   * 포트폴리오 업데이트 알림 템플릿 생성
   */
  generatePortfolioUpdateTemplate(data: any): { title: string; message: string } {
    const { totalValue, changePercent, changeAmount } = data;
    const changeType = changePercent > 0 ? '상승' : '하락';
    
    return {
      title: '포트폴리오 업데이트',
      message: `포트폴리오 가치가 ${changePercent}% ${changeType}했습니다.\n총 가치: ${totalValue?.toLocaleString()}원\n변화금액: ${changeAmount?.toLocaleString()}원`,
    };
  }

  /**
   * 전략 실행 알림 템플릿 생성
   */
  generateStrategyTriggeredTemplate(data: any): { title: string; message: string } {
    const { strategyName, action, symbol, reason } = data;
    
    return {
      title: '자동 거래 전략 실행',
      message: `${strategyName} 전략이 실행되어 ${action} 신호를 생성했습니다.\n대상: ${symbol}${reason ? `\n이유: ${reason}` : ''}`,
    };
  }

  /**
   * 시스템 알림 템플릿 생성
   */
  generateSystemAlertTemplate(data: any): { title: string; message: string } {
    const { message, level, module } = data;
    
    return {
      title: '시스템 알림',
      message: `${module} 모듈에서 ${level} 레벨 알림이 발생했습니다.\n${message}`,
    };
  }

  /**
   * 주문 체결 알림 템플릿 생성
   */
  generateOrderExecutionTemplate(data: any): { title: string; message: string } {
    const { symbol, side, quantity, price, orderType } = data;
    const action = side === 'BUY' ? '매수' : '매도';
    
    return {
      title: '주문 체결',
      message: `${symbol} ${action} 주문이 체결되었습니다.\n수량: ${quantity}주\n가격: ${price?.toLocaleString()}원\n주문유형: ${orderType}`,
    };
  }

  /**
   * 주문 취소 알림 템플릿 생성
   */
  generateOrderCancellationTemplate(data: any): { title: string; message: string } {
    const { symbol, orderId, reason } = data;
    
    return {
      title: '주문 취소',
      message: `${symbol} 주문이 취소되었습니다.\n주문번호: ${orderId}${reason ? `\n취소사유: ${reason}` : ''}`,
    };
  }

  /**
   * 잔고 부족 알림 템플릿 생성
   */
  generateInsufficientBalanceTemplate(data: any): { title: string; message: string } {
    const { requiredAmount, availableAmount, symbol } = data;
    
    return {
      title: '잔고 부족',
      message: `${symbol} 거래에 필요한 잔고가 부족합니다.\n필요금액: ${requiredAmount?.toLocaleString()}원\n보유금액: ${availableAmount?.toLocaleString()}원`,
    };
  }

  /**
   * 로그인 알림 템플릿 생성
   */
  generateLoginAlertTemplate(data: any): { title: string; message: string } {
    const { location, device, timestamp } = data;
    
    return {
      title: '새로운 로그인',
      message: `새로운 기기에서 로그인이 감지되었습니다.\n위치: ${location}\n기기: ${device}\n시간: ${new Date(timestamp).toLocaleString('ko-KR')}`,
    };
  }

  /**
   * 보안 알림 템플릿 생성
   */
  generateSecurityAlertTemplate(data: any): { title: string; message: string } {
    const { event, description, severity } = data;
    
    return {
      title: '보안 알림',
      message: `${event} 이벤트가 발생했습니다.\n${description}\n심각도: ${severity}`,
    };
  }

  /**
   * 성능 알림 템플릿 생성
   */
  generatePerformanceAlertTemplate(data: any): { title: string; message: string } {
    const { metric, value, threshold, component } = data;
    
    return {
      title: '성능 알림',
      message: `${component}의 ${metric}이 임계값을 초과했습니다.\n현재값: ${value}\n임계값: ${threshold}`,
    };
  }

  /**
   * 일반 알림 템플릿 생성
   */
  generateGeneralNotificationTemplate(data: any): { title: string; message: string } {
    const { title, message, priority } = data;
    
    return {
      title: title || '알림',
      message: message || '새로운 알림이 있습니다.',
    };
  }

  /**
   * 알림 우선순위에 따른 이모지 추가
   */
  addPriorityEmoji(title: string, priority: string): string {
    const emojiMap = {
      high: '🔴',
      medium: '🟡',
      low: '🟢',
    };
    
    const emoji = emojiMap[priority] || '📢';
    return `${emoji} ${title}`;
  }

  /**
   * 알림 타입에 따른 이모지 추가
   */
  addTypeEmoji(title: string, type: string): string {
    const emojiMap = {
      TRADE_EXECUTED: '💰',
      PRICE_ALERT: '📈',
      PORTFOLIO_UPDATE: '📊',
      STRATEGY_TRIGGERED: '🤖',
      SYSTEM_ALERT: '⚠️',
      ORDER_EXECUTION: '✅',
      ORDER_CANCELLATION: '❌',
      INSUFFICIENT_BALANCE: '💸',
      LOGIN_ALERT: '🔐',
      SECURITY_ALERT: '🚨',
      PERFORMANCE_ALERT: '⚡',
    };
    
    const emoji = emojiMap[type] || '📢';
    return `${emoji} ${title}`;
  }

  /**
   * 알림 메시지 포맷팅
   */
  formatNotificationMessage(template: { title: string; message: string }, type: string, priority: string): {
    title: string;
    message: string;
  } {
    const formattedTitle = this.addTypeEmoji(
      this.addPriorityEmoji(template.title, priority),
      type
    );

    return {
      title: formattedTitle,
      message: template.message,
    };
  }
} 