# 주식 자동매매 시스템 데이터베이스 스키마 설계

## 개요
테슬라 주식 자동매매 시스템을 위한 PostgreSQL 데이터베이스 스키마입니다.

## 테이블 구조

### 1. users (사용자 테이블)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. stocks (주식 정보 테이블)
```sql
CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) UNIQUE NOT NULL, -- TSLA
    company_name VARCHAR(255) NOT NULL, -- Tesla, Inc.
    current_price DECIMAL(10,2),
    previous_close DECIMAL(10,2),
    volume BIGINT,
    market_cap DECIMAL(20,2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. portfolios (포트폴리오 테이블)
```sql
CREATE TABLE portfolios (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    total_value DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. portfolio_holdings (포트폴리오 보유 주식 테이블)
```sql
CREATE TABLE portfolio_holdings (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    average_price DECIMAL(10,2) NOT NULL,
    total_invested DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. transactions (거래 내역 테이블)
```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('BUY', 'SELL')),
    quantity INTEGER NOT NULL,
    price_per_share DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED', 'FAILED')),
    fees DECIMAL(10,2) DEFAULT 0,
    notes TEXT
);
```

### 6. trading_strategies (자동매매 전략 테이블)
```sql
CREATE TABLE trading_strategies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    strategy_type VARCHAR(50) NOT NULL, -- 'MOVING_AVERAGE', 'RSI', 'BOLLINGER_BANDS', etc.
    parameters JSONB NOT NULL, -- 전략별 파라미터 (예: { "period": 14, "threshold": 0.7 })
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. strategy_executions (전략 실행 내역 테이블)
```sql
CREATE TABLE strategy_executions (
    id SERIAL PRIMARY KEY,
    strategy_id INTEGER REFERENCES trading_strategies(id) ON DELETE CASCADE,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    action VARCHAR(10) NOT NULL CHECK (action IN ('BUY', 'SELL', 'HOLD')),
    signal_strength DECIMAL(5,4), -- 0.0 ~ 1.0
    current_price DECIMAL(10,2),
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);
```

### 8. notifications (알림 테이블)
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'TRADE_EXECUTED', 'PRICE_ALERT', 'PORTFOLIO_UPDATE'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9. price_alerts (가격 알림 테이블)
```sql
CREATE TABLE price_alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('ABOVE', 'BELOW')),
    target_price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 인덱스
```sql
-- 성능 최적화를 위한 인덱스
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_stock_id ON transactions(stock_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_portfolio_holdings_portfolio_id ON portfolio_holdings(portfolio_id);
CREATE INDEX idx_strategy_executions_strategy_id ON strategy_executions(strategy_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_price_alerts_user_id ON price_alerts(user_id);
```

## 제약 조건
- 모든 금액 필드는 양수여야 함
- 거래 수량은 양수여야 함
- 전략 파라미터는 유효한 JSON 형식이어야 함
- 이메일은 유효한 형식이어야 함

## 관계
- users (1) : (N) portfolios
- users (1) : (N) transactions
- users (1) : (N) trading_strategies
- portfolios (1) : (N) portfolio_holdings
- stocks (1) : (N) portfolio_holdings
- stocks (1) : (N) transactions
- trading_strategies (1) : (N) strategy_executions 