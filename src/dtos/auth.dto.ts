import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 회원가입 요청 DTO
 * 새로운 사용자 계정 생성을 위한 데이터 전송 객체
 */
export class RegisterDto {
  /** 사용자 이메일 주소 (로그인 ID로 사용) */
  @ApiProperty({
    description: '사용자 이메일 주소 (로그인 ID로 사용)',
    example: 'user@example.com',
    type: String,
  })
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @Matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    { message: '올바른 이메일 형식을 입력해주세요.' }
  )
  email: string;

  /** 사용자 비밀번호 (최소 10자 이상, 대문자/소문자/숫자/특수문자 포함) */
  @ApiProperty({
    description: '사용자 비밀번호 (최소 10자 이상, 대문자/소문자/숫자/특수문자 포함)',
    example: 'Password123!',
    minLength: 10,
    type: String,
  })
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(10, { message: '비밀번호는 최소 10자 이상이어야 합니다.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { 
      message: '비밀번호는 대문자, 소문자, 숫자, 특수문자(@$!%*?&)를 각각 하나 이상 포함해야 합니다.' 
    }
  )
  password: string;

  /** 사용자 이름 */
  @ApiProperty({
    description: '사용자 이름',
    example: '홍',
    type: String,
  })
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  @Matches(
    /^[가-힣a-zA-Z\s]{1,20}$/,
    { message: '이름은 1-20자의 한글, 영문, 공백만 허용됩니다.' }
  )
  firstName: string;

  /** 사용자 성 */
  @ApiProperty({
    description: '사용자 성',
    example: '길동',
    type: String,
  })
  @IsString({ message: '성은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '성을 입력해주세요.' })
  @Matches(
    /^[가-힣a-zA-Z\s]{1,20}$/,
    { message: '성은 1-20자의 한글, 영문, 공백만 허용됩니다.' }
  )
  lastName: string;
}

/**
 * 로그인 요청 DTO
 * 사용자 인증을 위한 데이터 전송 객체
 */
export class LoginDto {
  /** 사용자 이메일 주소 */
  @ApiProperty({
    description: '사용자 이메일 주소',
    example: 'user@example.com',
    type: String,
  })
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @Matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    { message: '올바른 이메일 형식을 입력해주세요.' }
  )
  email: string;

  /** 사용자 비밀번호 */
  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'password123',
    type: String,
  })
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  password: string;
}

/**
 * 사용자 정보 업데이트 DTO
 * 기존 사용자 정보 수정을 위한 데이터 전송 객체
 */
export class UpdateUserDto {
  /** 사용자 이름 (선택사항) */
  @ApiProperty({
    description: '사용자 이름 (선택사항)',
    example: '홍',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @Matches(
    /^[가-힣a-zA-Z\s]{1,20}$/,
    { message: '이름은 1-20자의 한글, 영문, 공백만 허용됩니다.' }
  )
  firstName?: string;

  /** 사용자 성 (선택사항) */
  @ApiProperty({
    description: '사용자 성 (선택사항)',
    example: '길동',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ message: '성은 문자열이어야 합니다.' })
  @Matches(
    /^[가-힣a-zA-Z\s]{1,20}$/,
    { message: '성은 1-20자의 한글, 영문, 공백만 허용됩니다.' }
  )
  lastName?: string;

  /** 새로운 비밀번호 (선택사항, 최소 10자 이상, 대문자/소문자/숫자/특수문자 포함) */
  @ApiProperty({
    description: '새로운 비밀번호 (선택사항, 최소 10자 이상, 대문자/소문자/숫자/특수문자 포함)',
    example: 'NewPassword123!',
    required: false,
    minLength: 10,
    type: String,
  })
  @IsOptional()
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(10, { message: '비밀번호는 최소 10자 이상이어야 합니다.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { 
      message: '비밀번호는 대문자, 소문자, 숫자, 특수문자(@$!%*?&)를 각각 하나 이상 포함해야 합니다.' 
    }
  )
  password?: string;
}

/**
 * 사용자 정보 응답 DTO
 * API 응답으로 사용되는 사용자 정보 데이터 전송 객체
 */
export class UserResponseDto {
  /** 사용자 고유 ID */
  @ApiProperty({
    description: '사용자 고유 ID',
    example: 1,
    type: Number,
  })
  id: number;

  /** 사용자 이메일 주소 */
  @ApiProperty({
    description: '사용자 이메일 주소',
    example: 'user@example.com',
    type: String,
  })
  email: string;

  /** 사용자 이름 */
  @ApiProperty({
    description: '사용자 이름',
    example: '홍',
    type: String,
  })
  firstName: string;

  /** 사용자 성 */
  @ApiProperty({
    description: '사용자 성',
    example: '길동',
    type: String,
  })
  lastName: string;

  /** 계정 활성화 상태 */
  @ApiProperty({
    description: '계정 활성화 상태',
    example: true,
    type: Boolean,
  })
  isActive: boolean;

  /** 계정 생성 일시 */
  @ApiProperty({
    description: '계정 생성 일시',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  createdAt: Date;

  /** 계정 정보 수정 일시 */
  @ApiProperty({
    description: '계정 정보 수정 일시',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  updatedAt: Date;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

/**
 * 로그인 응답 DTO
 * 로그인 성공 시 반환되는 데이터 전송 객체
 */
export class LoginResponseDto {
  /** 사용자 정보 */
  @ApiProperty({
    description: '사용자 정보',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  /** 액세스 토큰 (JWT) */
  @ApiProperty({
    description: '액세스 토큰 (JWT)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  accessToken: string;

  /** 리프레시 토큰 */
  @ApiProperty({
    description: '리프레시 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  refreshToken: string;

  constructor(user: any, accessToken: string, refreshToken: string) {
    this.user = new UserResponseDto(user);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

/**
 * 토큰 갱신 요청 DTO
 * 액세스 토큰 갱신을 위한 데이터 전송 객체
 */
export class RefreshTokenDto {
  /** 리프레시 토큰 */
  @ApiProperty({
    description: '리프레시 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  @IsString({ message: '리프레시 토큰은 문자열이어야 합니다.' })
  refreshToken: string;
} 