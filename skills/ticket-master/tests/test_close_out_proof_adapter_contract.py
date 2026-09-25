"""Contract tests for ticket-master close-out proof guidance."""

from pathlib import Path
import unittest


SKILL_PATH = Path(__file__).resolve().parents[1] / "SKILL.md"
CLI_SKILL_PATH = Path(__file__).resolve().parents[2] / "linear-cli" / "SKILL.md"


class CloseOutProofAdapterContractTest(unittest.TestCase):
    def test_completion_document_declares_completion_artifact_proof(self) -> None:
        """The close-out adapter must expose the artifact used to prove completion."""
        skill_text = SKILL_PATH.read_text(encoding="utf-8")
        template_start = skill_text.index("### Completion Document Template")
        fence_start = skill_text.index("```", template_start)
        fence_end = skill_text.index("```", fence_start + 3)
        template = skill_text[fence_start + 3 : fence_end]

        self.assertIn(
            "- Completion artifact: {{artifact URL or ID}}",
            template,
            f"missing close-out proof contract in {SKILL_PATH}",
        )


    def test_close_out_retry_reuses_artifact_with_ticket_revision_key_and_records_partial_failures(self) -> None:
        """Retries reuse one close-out artifact and preserve partial publication state."""
        skill_text = SKILL_PATH.read_text(encoding="utf-8")

        self.assertIn(
            "idempotency key based on the ticket ID and verification revision",
            skill_text,
            f"missing ticket-plus-verification-revision idempotency contract in {SKILL_PATH}",
        )
        self.assertIn(
            "reuse the existing completion artifact without duplicate comments, documents, or attachments",
            skill_text,
            f"missing duplicate-free artifact reuse contract in {SKILL_PATH}",
        )
        self.assertIn(
            "record partial publication and status failures before retrying",
            skill_text,
            f"missing partial close-out failure recording contract in {SKILL_PATH}",
        )


    def test_close_out_records_supported_metadata_or_one_fallback_and_verifies_attached_evidence(self) -> None:
        """Close-out preserves evidence through supported fields or one visible artifact."""
        skill_text = SKILL_PATH.read_text(encoding="utf-8")
        cli_skill_text = CLI_SKILL_PATH.read_text(encoding="utf-8")

        self.assertIn(
            "dedicated completion metadata fields when supported",
            skill_text,
            f"missing supported-field close-out contract in {SKILL_PATH}",
        )
        self.assertIn(
            "one completion comment or document when dedicated fields are unavailable",
            skill_text,
            f"missing fallback close-out contract in {SKILL_PATH}",
        )
        self.assertIn(
            "attach evidence files",
            cli_skill_text,
            f"missing ticket CLI evidence attachment guidance in {CLI_SKILL_PATH}",
        )
        self.assertIn(
            "--attach",
            cli_skill_text,
            f"missing ticket CLI attachment flag guidance in {CLI_SKILL_PATH}",
        )
        self.assertIn(
            "Verify visible writes afterward",
            cli_skill_text,
            f"missing ticket CLI visible-write verification guidance in {CLI_SKILL_PATH}",
        )


    def test_close_out_retry_protocol_has_canonical_identity_states_and_resume_rules(self) -> None:
        """Retries reconcile proof artifacts, track explicit states, and resume safely."""
        skill_text = SKILL_PATH.read_text(encoding="utf-8")

        self.assertIn(
            "closeout:{{ticket ID}}:{{verification revision}}",
            skill_text,
            f"missing canonical close-out idempotency key in {SKILL_PATH}",
        )
        self.assertIn(
            "reconcile the existing completion artifact before creating a new one",
            skill_text,
            f"missing artifact reconciliation-before-create rule in {SKILL_PATH}",
        )
        self.assertIn(
            "attachment identity by role plus checksum",
            skill_text,
            f"missing role-and-checksum attachment identity rule in {SKILL_PATH}",
        )
        self.assertIn(
            "not_started/artifact_published/metadata_published/status_transitioned/verified/failed",
            skill_text,
            f"missing explicit close-out states in {SKILL_PATH}",
        )
        self.assertIn(
            "resume status-only only when the artifact and required metadata are confirmed published and the status transition failed",
            skill_text,
            f"missing safe status-only retry preconditions in {SKILL_PATH}",
        )
        self.assertIn(
            "reconcile or retry artifact publication before attempting any status transition when artifact publication is unconfirmed",
            skill_text,
            f"missing artifact-publication recovery ordering rule in {SKILL_PATH}",
        )
        self.assertIn(
            "Do not claim completion until artifact and status verification are both confirmed",
            skill_text,
            f"missing completion verification gate in {SKILL_PATH}",
        )


    def test_child_and_parent_status_transitions_require_confirmed_close_out_proof(self) -> None:
        """Child and parent status changes require confirmed proof and safe retry gates."""
        skill_text = SKILL_PATH.read_text(encoding="utf-8")

        required_contract = (
            "Before every child or parent status transition, read back and confirm the completion artifact, "
            "required metadata, canonical close-out key and state, and attachments.",
            "Only transition status from confirmed metadata_published and an eligible non-terminal status.",
            "Do not transition status when the completion artifact or required metadata is unconfirmed.",
            "A status-only retry must not transition status unless the prior status transition failed.",
        )
        for contract in required_contract:
            self.assertIn(
                contract,
                skill_text,
                f"missing status-transition proof gate in {SKILL_PATH}: {contract}",
            )


    def test_close_out_persists_proof_identity_and_reconciles_each_transition(self) -> None:
        """Close-out retries must persist identity and confirm every state transition."""
        skill_text = SKILL_PATH.read_text(encoding="utf-8")

        self.assertIn(
            "persist the canonical close-out key, current close-out state, and attachment identity (role plus checksum) in ticket metadata or the completion artifact",
            skill_text,
            f"missing durable close-out proof identity contract in {SKILL_PATH}",
        )
        self.assertIn(
            "read back and reconcile the persisted state after each transition before the next write",
            skill_text,
            f"missing read-back reconciliation ordering contract in {SKILL_PATH}",
        )
        self.assertIn(
            "resume an interrupted transition from the last confirmed persisted state",
            skill_text,
            f"missing interrupted-transition resume contract in {SKILL_PATH}",
        )


if __name__ == "__main__":
    unittest.main()
