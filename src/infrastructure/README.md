# Infrastructure Layer

클린아키텍처의 인프라 레이어입니다. 외부 시스템과의 연동을 담당합니다.

## 구조

- **database/**: 데이터베이스 관련 (TypeORM 설정, 마이그레이션 등)
- **external-apis/**: 외부 API 연동 (주식 데이터 API, 알림 API 등)
- **config/**: 설정 관리 (환경 변수, 데이터베이스 설정 등)
- **logging/**: 로깅 시스템 (Winston 설정 등)

## 특징

- 외부 시스템과의 연동
- 데이터베이스 접근 구현
- 설정 및 로깅 관리 