export class JwtPayloadDto {
  sub: string;
  familyId: string;
  userId: number;

  constructor(sub: string, familyId: string, userId: number) {
    this.sub = sub;
    this.familyId = familyId;
    this.userId = userId;
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
