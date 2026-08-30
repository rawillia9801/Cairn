# Cairn Recovery Validation Principle

**Status:** Research and engineering principle  
**Scope:** Backup, checkpoint, restore, migration and continuity validation

> **A backup is not validated when it is created. It is validated when recovery from it succeeds.**

Creating a copy demonstrates storage. Cairn treats recoverability as a separate property that must be exercised and measured.

A successful recovery test should establish, as applicable, that:

1. recovered original history is intact and correctly ordered;
2. recorded hashes, signatures and checkpoint integrity checks validate;
3. authoritative state reconstructs to the expected baseline;
4. unresolved commitments and obligations survive recovery;
5. provenance remains attributable to the correct evidence and events;
6. derived summaries or caches do not silently replace original evidence;
7. corruption, omission, reordering or replay is detected rather than accepted as valid history; and
8. the recovered system can resume from the verified state expected by the test specification.

## Measurement distinction

Cairn should report these separately:

- **Backup creation success:** a protected copy was produced and stored.
- **Backup integrity verification:** the stored copy matches its recorded integrity evidence.
- **Recovery success:** the copy can actually be restored into a usable reconstruction environment.
- **Continuity recovery correctness:** the recovered history, state, commitments and provenance match the predefined expected operational baseline.

A green backup job alone must never be reported as proof of recoverability.

## Working formulation

**Preservation without recoverability is storage.  
Recoverability without verification is hope.  
Continuity requires both.**

This principle applies to synthetic Phase I benchmark data as well as later authorized Cairn runtime backups. Pre-genesis research must continue to use disposable, explicitly non-authoritative data and must not initialize Cairn in order to demonstrate recovery mechanics.
