/**
 * 마이페이지 타입 정의
 */

export interface MyInfoDTO {
  userId: string;
  name: string;
  companyName: string;
  department: string;
  position: string;
  type: string;
  workerType: string;
  officePhone: string;
  mobile: string;
  email: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  birthDate: string;
  gender: string;
}

export interface MyInfoVO {
  name: string;
  department?: string;
  position?: string;
  officePhone?: string;
  mobile: string;
  email?: string;
  zipCode?: string;
  address?: string;
  addressDetail?: string;
  birthDate?: string;
}

export interface PasswordChangeVO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
