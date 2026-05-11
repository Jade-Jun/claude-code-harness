/**
 * Entity 예시 — namespace + initData 패턴
 *
 * Entity는 API 응답을 프론트엔드 도메인 모델로 변환한 타입이다.
 * namespace 패턴으로 관련 타입을 그룹화하고,
 * initData로 기본값을 정의하여 런타임 안정성을 확보한다.
 */

export namespace Sample {
  export interface Entity {
    id: number;
    name: string;
    status: 'active' | 'inactive';
    score: number;
    createdAt: string;
  }

  export interface ListRequest {
    page: number;
    size: number;
    search?: string;
  }

  export interface ListResponse {
    items: Entity[];
    total: number;
  }

  /** 모든 Entity에 initData를 정의한다. 빈 상태의 안전한 기본값. */
  export const initData: Entity = {
    id: 0,
    name: '',
    status: 'active',
    score: 0,
    createdAt: '',
  };
}
