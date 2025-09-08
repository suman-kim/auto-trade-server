# 보안 설정 및 구현 가이드

## 개요

이 문서는 자동매매 시스템의 보안 기능과 설정에 대해 설명합니다.

## 구현된 보안 기능

### 1. 보안 미들웨어 (SecurityMiddleware)

**위치**: `src/infrastructure/middleware/security.middleware.ts`

**기능**:
- 보안 헤더 설정
- Rate Limiting 적용
- CORS 보안 강화

**보안 헤더**:
```typescript
X-XSS-Protection: 1; mode=block          // XSS 방지
X-Frame-Options: DENY                     // 클릭재킹 방지
X-Content-Type-Options: nosniff          // MIME 타입 스니핑 방지
Strict-Transport-Security: max-age=31536000; includeSubDomains  // HSTS
Content-Security-Policy: default-src 'self'...                   // CSP
Referrer-Policy: strict-origin-when-cross-origin                // Referrer 정책
Permissions-Policy: geolocation=()...                           // 권한 정책
```

**Rate Limiting**:
- 인증 엔드포인트 (`/auth`): 15분당 5회
- 일반 API 엔드포인트 (`/api`): 15분당 100회
- 글로벌 제한: 15분당 1000회

### 2. 보안 가드 (SecurityGuard)

**위치**: `src/shared/guards/security.guard.ts`

**기능**:
- IP 주소 검증 (화이트리스트)
- 요청 크기 제한 (10MB)
- User-Agent 검증
- 의심스러운 요청 차단

**IP 검증**:
- 로컬호스트 허용: `127.0.0.1`, `::1`
- 사설 네트워크 허용: `192.168.x.x`, `10.x.x.x`
- 환경변수 `ALLOWED_IPS`로 추가 IP 설정 가능

**User-Agent 차단 패턴**:
- `bot`, `crawler`, `spider`, `scraper`, `curl`, `wget`

### 3. 강화된 입력 검증

**위치**: `src/application/dtos/auth.dto.ts`

**비밀번호 정책**:
- 최소 10자
- 대문자, 소문자, 숫자, 특수문자 포함
- 정규식: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$`

**이름 정책**:
- 한국어, 영어, 공백만 허용
- 길이: 1-20자
- 정규식: `^[가-힣a-zA-Z\s]{1,20}$`

**이메일 정책**:
- 엄격한 이메일 형식 검증
- 정규식: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

## 환경 변수 설정

### 필수 보안 환경 변수

```bash
# JWT 설정
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=24h

# 보안 설정
ALLOWED_IPS=127.0.0.1,::1,192.168.1.0/24
MAX_REQUEST_SIZE=10485760
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
REGISTER_RATE_LIMIT_MAX_REQUESTS=3
```

### 권장 JWT 시크릿 생성

```bash
# 64자 랜덤 문자열 생성
openssl rand -base64 64

# 또는 Node.js로 생성
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

## 보안 테스트

### 단위 테스트 실행

```bash
# 보안 가드 테스트
npm test -- --testPathPattern="security.guard.spec.ts"

# 보안 미들웨어 테스트
npm test -- --testPathPattern="security.middleware.spec.ts"
```

### 보안 헤더 확인

```bash
# curl로 보안 헤더 확인
curl -I http://localhost:3000/api/health

# 예상 응답 헤더
X-XSS-Protection: 1; mode=block
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'...
```

## 보안 모니터링

### 로그 확인

보안 관련 이벤트는 다음 위치에서 모니터링할 수 있습니다:

1. **Rate Limiting 로그**: `logs/rate-limit.log`
2. **보안 가드 로그**: `logs/security.log`
3. **일반 애플리케이션 로그**: `logs/app.log`

### 모니터링 API

```bash
# 보안 통계 확인
GET /api/monitoring/security-stats

# Rate Limiting 상태 확인
GET /api/monitoring/rate-limit-status

# 차단된 IP 목록 확인
GET /api/monitoring/blocked-ips
```

## 보안 모범 사례

### 1. 환경 변수 관리

- `.env` 파일을 `.gitignore`에 추가
- 프로덕션에서는 환경 변수 관리 서비스 사용
- 민감한 정보는 암호화하여 저장

### 2. 정기적인 보안 업데이트

- 의존성 패키지 정기 업데이트
- 보안 취약점 스캔 실행
- 로그 모니터링 및 분석

### 3. 접근 제어

- 최소 권한 원칙 적용
- IP 화이트리스트 정기 업데이트
- 사용자 권한 정기 검토

### 4. 감사 및 로깅

- 모든 보안 이벤트 로깅
- 로그 무결성 보장
- 정기적인 로그 분석

## 문제 해결

### 일반적인 보안 오류

1. **"Access denied from this IP address"**
   - `ALLOWED_IPS` 환경변수 확인
   - 클라이언트 IP 주소 확인

2. **"Request too large"**
   - `MAX_REQUEST_SIZE` 환경변수 확인
   - 요청 본문 크기 확인

3. **"Suspicious User-Agent detected"**
   - 클라이언트 User-Agent 확인
   - 필요시 예외 처리 추가

### 보안 설정 디버깅

```bash
# 환경변수 확인
echo $ALLOWED_IPS
echo $MAX_REQUEST_SIZE

# 로그 레벨 설정
export LOG_LEVEL=debug

# 보안 가드 비활성화 (개발용)
export DISABLE_SECURITY_GUARD=true
```

## 추가 보안 기능 계획

### 향후 구현 예정

1. **2FA (Two-Factor Authentication)**
2. **API 키 관리**
3. **IP 기반 지리적 제한**
4. **행동 기반 이상 탐지**
5. **암호화된 세션 저장소**

### 커스터마이징

보안 기능은 모듈화되어 있어 필요에 따라 쉽게 수정할 수 있습니다:

- `SecurityMiddleware`에서 헤더 추가/수정
- `SecurityGuard`에서 검증 로직 추가
- 환경변수로 동적 설정 변경

