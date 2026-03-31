// export interface User {
//   userId: number;
//   userName: string;
//   emailId: string;
//   fullName: string;
//   role: string;
//   createdDate: string;
//   password: string;
//   projectName: string;
//   refreshToken: string;
//   refreshTokenExpiryTime: string;
// }


export interface UserAddress {
  city:        string;
  state:       string;
  pincode:     string;
  addressLine: string;
}

export interface UserSocialDetails {
  facebookProfileUrl: string;
  linkdinProfileUrl:  string;
  instagramHandle:    string;
  twitterHandle:      string;
}

export interface User {
  userId:            number;
  firstName:         string;
  middleName:        string;
  lastName:          string;
  mobileNo:          string;
  emailId:           string;
  altMobileNo:       string;
  password:          string;
  userAddress:       UserAddress;
  userSocialDetails: UserSocialDetails;
}