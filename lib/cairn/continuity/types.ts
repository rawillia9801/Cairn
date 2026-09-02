export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };

export type ContinuityActorKind = "human" | "model" | "service" | "system";

export interface ContinuityActor {
  id: string;
  kind: ContinuityActorKind;
}

export interface ContinuitySource {
  system: string;
  instance?: string;
  model?: string;
  provider?: string;
}

export interface ArtifactReference {
  sha256: string;
  mediaType?: string;
  uri?: string;
}

export interface ContinuityEventDraft {
  id: string;
  recordedAt: string;
  eventType: string;
  actor: ContinuityActor;
  source: ContinuitySource;
  artifacts?: ArtifactReference[];
  payload: JsonValue;
}

export interface ContinuityEvent {
  schemaVersion: "cairn.event.v1";
  id: string;
  sequence: number;
  recordedAt: string;
  eventType: string;
  actor: ContinuityActor;
  source: ContinuitySource;
  predecessorHash: string | null;
  artifacts: ArtifactReference[];
  payload: JsonValue;
  hashAlgorithm: "sha256";
  eventHash: string;
}

export type LedgerIntegrityIssueCode =
  | "INVALID_SCHEMA_VERSION"
  | "INVALID_HASH_ALGORITHM"
  | "INVALID_EVENT_ID"
  | "DUPLICATE_EVENT_ID"
  | "INVALID_RECORDED_AT"
  | "INVALID_EVENT_TYPE"
  | "INVALID_ACTOR"
  | "INVALID_SOURCE"
  | "INVALID_SEQUENCE"
  | "INVALID_PREDECESSOR_HASH"
  | "INVALID_ARTIFACT_HASH"
  | "INVALID_EVENT_HASH"
  | "EVENT_HASH_MISMATCH";

export interface LedgerIntegrityIssue {
  index: number;
  sequence: number | null;
  eventId: string | null;
  code: LedgerIntegrityIssueCode;
  message: string;
}

export interface LedgerVerificationResult {
  valid: boolean;
  checkedEvents: number;
  lastValidSequence: number | null;
  lastValidHash: string | null;
  issues: LedgerIntegrityIssue[];
}
