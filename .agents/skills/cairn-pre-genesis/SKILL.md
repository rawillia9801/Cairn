# Cairn Pre-Genesis Research Skill

Use this skill for Cairn research and benchmark work before genesis.

Core rule: exercise the pipes, not Cairn.

Before any experiment:

1. Map the work to Q1, Q2, or Q3 in `docs/research/phase-i-validation-plan.md`.
2. Use only synthetic, disposable benchmark data.
3. Create an experiment manifest and validate it with `npm run research:validate-manifest -- <manifest-path>`.
4. Record dataset version/hash, model/provider/version, configuration hash, host profile, timestamps, raw metrics, and failures.
5. Keep systems-integrity metrics separate from model-quality metrics.
6. Preserve negative findings and append corrections rather than rewriting prior results.
7. Keep all experiment outputs isolated from future canonical Cairn state.

Parallel-agent tools such as OpenResearch may orchestrate experiments and retain disposable evidence, but they are not a Cairn system of record.

Stop any experiment that cannot be deleted without affecting future canonical Cairn state.
