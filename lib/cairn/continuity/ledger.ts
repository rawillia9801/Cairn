import { createHash } from "node:crypto";

import { canonicalizeJson } from "./canonicalize";
import type {
  ArtifactReference,
  ContinuityActorKind,
  ContinuityEvent,
  ContinuityEventDraft,
  JsonValue,
  LedgerIntegrityIssue,
  LedgerVerificationResult,
} from "./types";

const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const ACTOR_KINDS = new Set<ContinuityActorKind>([
  "human",
  "model",
  "service",
  "system",
]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSha256(value: unknown): value is string {
  return typeof value === "string" && SHA256_PATTERN.test(value);
}

function isValidTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function artifactToJson(artifact: ArtifactReference): JsonValue {
  const result: { [key: string]: JsonValue } = {
    sha256: artifact.sha256,
  };

  if (artifact.mediaType !== undefined) {
    result.mediaType = artifact.mediaType;
  }

  if (artifact.uri !== undefined) {
    result.uri = artifact.uri;
  }

  return result;
}

function eventHashMaterial(
  event: Omit<ContinuityEvent, "eventHash">,
): JsonValue {
  const source: { [key: string]: JsonValue } = {
    system: event.source.system,
  };

  if (event.source.instance !== undefined) {
    source.instance = event.source.instance;
  }

  if (event.source.model !== undefined) {
    source.model = event.source.model;
  }

  if (event.source.provider !== undefined) {
    source.provider = event.source.provider;
  }

  return {
    schemaVersion: event.schemaVersion,
    id: event.id,
    sequence: event.sequence,
    recordedAt: event.recordedAt,
    eventType: event.eventType,
    actor: {
      id: event.actor.id,
      kind: event.actor.kind,
    },
    source,
    predecessorHash: event.predecessorHash,
    artifacts: event.artifacts.map(artifactToJson),
    payload: event.payload,
    hashAlgorithm: event.hashAlgorithm,
  };
}

function calculateEventHash(
  event: Omit<ContinuityEvent, "eventHash">,
): string {
  const canonical = canonicalizeJson(eventHashMaterial(event));
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}

function issue(
  issues: LedgerIntegrityIssue[],
  event: ContinuityEvent,
  index: number,
  code: LedgerIntegrityIssue["code"],
  message: string,
): void {
  issues.push({
    index,
    sequence: Number.isInteger(event.sequence) ? event.sequence : null,
    eventId: typeof event.id === "string" ? event.id : null,
    code,
    message,
  });
}

export function sealContinuityEvent(
  event: Omit<ContinuityEvent, "eventHash">,
): ContinuityEvent {
  if (event.schemaVersion !== "cairn.event.v1") {
    throw new Error("Unsupported Cairn event schema version.");
  }

  if (event.hashAlgorithm !== "sha256") {
    throw new Error("Unsupported Cairn event hash algorithm.");
  }

  return {
    ...event,
    eventHash: calculateEventHash(event),
  };
}

export function verifyContinuityLedger(
  events: readonly ContinuityEvent[],
): LedgerVerificationResult {
  const issues: LedgerIntegrityIssue[] = [];
  const seenIds = new Set<string>();
  let prefixValid = true;
  let lastValidSequence: number | null = null;
  let lastValidHash: string | null = null;

  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    const issueCountBeforeEvent = issues.length;

    if (event.schemaVersion !== "cairn.event.v1") {
      issue(
        issues,
        event,
        index,
        "INVALID_SCHEMA_VERSION",
        `Event ${index + 1} does not use cairn.event.v1.`,
      );
    }

    if (event.hashAlgorithm !== "sha256") {
      issue(
        issues,
        event,
        index,
        "INVALID_HASH_ALGORITHM",
        `Event ${index + 1} does not use SHA-256.`,
      );
    }

    if (!isNonEmptyString(event.id)) {
      issue(
        issues,
        event,
        index,
        "INVALID_EVENT_ID",
        `Event ${index + 1} has an empty or invalid ID.`,
      );
    } else if (seenIds.has(event.id)) {
      issue(
        issues,
        event,
        index,
        "DUPLICATE_EVENT_ID",
        `Event ID ${event.id} appears more than once.`,
      );
    } else {
      seenIds.add(event.id);
    }

    if (!isValidTimestamp(event.recordedAt)) {
      issue(
        issues,
        event,
        index,
        "INVALID_RECORDED_AT",
        `Event ${event.id || index + 1} has an invalid recordedAt timestamp.`,
      );
    }

    if (!isNonEmptyString(event.eventType)) {
      issue(
        issues,
        event,
        index,
        "INVALID_EVENT_TYPE",
        `Event ${event.id || index + 1} has an invalid eventType.`,
      );
    }

    if (
      !event.actor ||
      !isNonEmptyString(event.actor.id) ||
      !ACTOR_KINDS.has(event.actor.kind)
    ) {
      issue(
        issues,
        event,
        index,
        "INVALID_ACTOR",
        `Event ${event.id || index + 1} has invalid actor metadata.`,
      );
    }

    if (!event.source || !isNonEmptyString(event.source.system)) {
      issue(
        issues,
        event,
        index,
        "INVALID_SOURCE",
        `Event ${event.id || index + 1} has invalid source metadata.`,
      );
    }

    const expectedSequence = index + 1;
    if (!Number.isInteger(event.sequence) || event.sequence !== expectedSequence) {
      issue(
        issues,
        event,
        index,
        "INVALID_SEQUENCE",
        `Expected sequence ${expectedSequence}, received ${String(event.sequence)}.`,
      );
    }

    const expectedPredecessor = index === 0 ? null : events[index - 1].eventHash;
    if (event.predecessorHash !== expectedPredecessor) {
      issue(
        issues,
        event,
        index,
        "INVALID_PREDECESSOR_HASH",
        index === 0
          ? "The first event must have predecessorHash = null."
          : `Event ${event.id || index + 1} does not reference the preceding event hash.`,
      );
    }

    if (!Array.isArray(event.artifacts)) {
      issue(
        issues,
        event,
        index,
        "INVALID_ARTIFACT_HASH",
        `Event ${event.id || index + 1} has an invalid artifacts collection.`,
      );
    } else {
      for (const artifact of event.artifacts) {
        if (!artifact || !isSha256(artifact.sha256)) {
          issue(
            issues,
            event,
            index,
            "INVALID_ARTIFACT_HASH",
            `Event ${event.id || index + 1} contains an invalid artifact SHA-256 reference.`,
          );
        }
      }
    }

    if (!isSha256(event.eventHash)) {
      issue(
        issues,
        event,
        index,
        "INVALID_EVENT_HASH",
        `Event ${event.id || index + 1} has an invalid eventHash format.`,
      );
    }

    try {
      const { eventHash: _eventHash, ...unsignedEvent } = event;
      const expectedHash = calculateEventHash(unsignedEvent);

      if (event.eventHash !== expectedHash) {
        issue(
          issues,
          event,
          index,
          "EVENT_HASH_MISMATCH",
          `Event ${event.id || index + 1} does not match its canonical SHA-256 hash.`,
        );
      }
    } catch (error) {
      issue(
        issues,
        event,
        index,
        "EVENT_HASH_MISMATCH",
        error instanceof Error
          ? `Event ${event.id || index + 1} could not be canonically hashed: ${error.message}`
          : `Event ${event.id || index + 1} could not be canonically hashed.`,
      );
    }

    const eventValid = issues.length === issueCountBeforeEvent;
    prefixValid = prefixValid && eventValid;

    if (prefixValid) {
      lastValidSequence = event.sequence;
      lastValidHash = event.eventHash;
    }
  }

  return {
    valid: issues.length === 0,
    checkedEvents: events.length,
    lastValidSequence,
    lastValidHash,
    issues,
  };
}

export function appendContinuityEvent(
  events: readonly ContinuityEvent[],
  draft: ContinuityEventDraft,
): ContinuityEvent {
  const verification = verifyContinuityLedger(events);

  if (!verification.valid) {
    const codes = verification.issues.map((entry) => entry.code).join(", ");
    throw new Error(
      `Refusing to append to an invalid Cairn continuity ledger. Integrity issues: ${codes}`,
    );
  }

  const previous = events.at(-1);
  const sealed = sealContinuityEvent({
    schemaVersion: "cairn.event.v1",
    id: draft.id,
    sequence: previous ? previous.sequence + 1 : 1,
    recordedAt: draft.recordedAt,
    eventType: draft.eventType,
    actor: draft.actor,
    source: draft.source,
    predecessorHash: previous?.eventHash ?? null,
    artifacts: draft.artifacts ? [...draft.artifacts] : [],
    payload: draft.payload,
    hashAlgorithm: "sha256",
  });

  const candidateVerification = verifyContinuityLedger([...events, sealed]);

  if (!candidateVerification.valid) {
    const newEventIssues = candidateVerification.issues
      .filter((entry) => entry.index === events.length)
      .map((entry) => entry.code)
      .join(", ");

    throw new Error(
      `Refusing to append an invalid Cairn continuity event. Integrity issues: ${newEventIssues || "unknown"}`,
    );
  }

  return sealed;
}
