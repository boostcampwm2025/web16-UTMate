export enum MissionResultStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

export class MissionResult {
  id: number;
  participantId: string;
  missionId: string;

  status: MissionResultStatus;
  duration: number;
  feedback: string | undefined;

  createdAt: Date;
  updatedAt: Date;

  // TODO 추가적으로 로그 분석하여 저장할 필드 정의

  private constructor(participantId: string, missionId: string) {
    this.participantId = participantId;
    this.missionId = missionId;
    this.status = MissionResultStatus.PENDING;
    this.duration = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static start(participantId: string, missionId: string): MissionResult {
    return new MissionResult(participantId, missionId);
  }

  complete(feedback?: string) {
    this.status = MissionResultStatus.COMPLETED;
    this.duration = Date.now() - this.createdAt.getTime();
    this.feedback = feedback;
    this.updatedAt = new Date();
  }

  fail(feedback?: string) {
    this.status = MissionResultStatus.FAILED;
    this.duration = Date.now() - this.createdAt.getTime();
    this.feedback = feedback;
    this.updatedAt = new Date();
  }

  skip() {
    this.status = MissionResultStatus.SKIPPED;
    this.duration = Date.now() - this.createdAt.getTime();
    this.updatedAt = new Date();
  }
}
