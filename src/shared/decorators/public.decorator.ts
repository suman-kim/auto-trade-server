import { SetMetadata } from '@nestjs/common';

/**
 * @Public() 데코레이터
 * 이 데코레이터가 적용된 엔드포인트는 JWT 인증을 건너뜁니다.
 */
export const Public = () => SetMetadata('isPublic', true); 