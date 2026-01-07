export class JwtPayloadDto {
  userId: string;
  familyId: string;

  constructor(userId: string, familyId: string) {
    this.userId = userId;
    this.familyId = familyId;
  }
}

export class RtPayloadDto {
  userId: string;
  familyId: string;
  refreshToken: string;

  constructor(userId: string, familyId: string, refreshToken: string) {
    this.userId = userId;
    this.familyId = familyId;
    this.refreshToken = refreshToken;
  }
}
